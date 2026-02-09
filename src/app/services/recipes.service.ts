import { Injectable, Signal, inject } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, QueryConstraint, QueryDocumentSnapshot, addDoc, collection, collectionData, doc, docData, getDocs, limit, query, setDoc, startAfter, where, orderBy } from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of, tap, map, from, forkJoin, debounceTime } from 'rxjs';
import { RecipeDto, RecipesListConfig } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore = inject(Firestore);

 recipesResource = rxResource<
    { recipes: RecipeDto[], lastDoc: QueryDocumentSnapshot<RecipeDto> | null, hasMore: boolean }, 
    { pageSize?: number, lastDoc?: QueryDocumentSnapshot<RecipeDto> | null, direction?: 'next' | 'prev' }
  >({
    params: () => ({ pageSize: 10, lastDoc: null, direction: 'next' }),
    stream: ({params}) => {
      const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
      const pageSize = params.pageSize ?? 10;
      const constraints: QueryConstraint[] = [
        limit(pageSize + 1)
      ];

      if (params.lastDoc) {
        constraints.push(startAfter(params.lastDoc));
      }

      const q = query(recipesCollection, ...constraints);

      return from(getDocs(q)).pipe(
        map(snapshot => {
          const docs = snapshot.docs;
          const hasMore = docs.length > pageSize;
          const recipes = docs.slice(0, pageSize).map(doc => ({ ...doc.data(), id: doc.id }));
          const lastDoc = docs.length > 0 ? docs[Math.min(pageSize - 1, docs.length - 1)] : null;
          
          return { recipes, lastDoc, hasMore };
        })
      );
    }
  });

  public createNewRecipeResource(recipe: RecipeDto): Observable<string> {
    const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
    return from(addDoc(recipesCollection, recipe)).pipe(
      map(docRef => docRef.id)
    );
  }

  public updateRecipeResource(id: string, recipe: RecipeDto): Observable<void> {
    const recipeDoc = doc(this.firestore, 'recipes', id) as DocumentReference<RecipeDto>;
    return from(setDoc(recipeDoc, recipe));
  }

  public getRecipeResourceById(id: Signal<string | null>) {
    return rxResource<RecipeDto | null, unknown>({
      params: () => (id()),
      stream: ({params}) => {
        if (!params) {
          return of(null);
        }

        const recipeDoc = doc(this.firestore, 'recipes', `${params}`) as DocumentReference<RecipeDto>;
        return docData<RecipeDto>(recipeDoc, { idField: 'id' }).pipe(
          map(data => data ?? null),
        );
      } 
    })
  }

  public getRecipeResourceBySlug(categoryID: Signal<string | null>, config: Signal<RecipesListConfig>) {
    return rxResource<{ recipes: RecipeDto[], hasMore: boolean } | null, { id: string | null, config: RecipesListConfig }>({
      params: () => {
        const id = categoryID();
        const cfg = config();
        console.log('🔍 getRecipeResourceBySlug params:', { id, page: cfg.page, limit: cfg.limit, hasPageLastElements: cfg.pageLastElements.size });
        return { id, config: cfg };
      },
      stream: ({params}) => {
        if (!params.id) {
          console.log('⚠️ No categoryID, returning null');
          return of(null);
        }
        const { limit: qLimit, page, pageLastElements } = params.config;
        const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
        
        // Récupérer le document snapshot pour startAfter si besoin
        let lastDocSnapshot: any = null;
        if (page > 1 && pageLastElements.has(page - 1)) {
          const lastRecipe = pageLastElements.get(page - 1)!;
          lastDocSnapshot = lastRecipe;
          console.log('📄 Using startAfter with recipe:', lastRecipe.id);
        }

        const constraints: QueryConstraint[] = [
          where('categoryID', '==', params.id),
          orderBy('__name__'), // Tri par ID du document (ne nécessite pas d'index)
          limit(qLimit + 1) // Charger +1 pour détecter s'il y a une page suivante
        ];

        if (lastDocSnapshot) {
          constraints.push(startAfter(lastDocSnapshot.id));
        }

        const q = query(recipesCollection, ...constraints);
        console.log('🔥 Executing query with', constraints.length, 'constraints');

        return from(getDocs(q)).pipe(
          tap(snapshot => console.log('✅ Got', snapshot.docs.length, 'recipes (requested', qLimit + 1, ')')),
          map(snapshot => {
            const docs = snapshot.docs;
            const hasMore = docs.length > qLimit;
            const recipes = docs.slice(0, qLimit).map(doc => ({ ...doc.data(), id: doc.id }));
            return { recipes, hasMore };
          }),
        );
      }
    });
  }

  public getRecipesByIdsResource(favoriteIds: Signal<string[]>, pageSize: number = 10) {
    return rxResource<RecipeDto[], { ids: string[], page: number }>({
      params: () => ({ ids: favoriteIds(), page: 0 }),
      stream: ({params}) => {
        const ids = params.ids;
        if (ids.length === 0) return of([]);
        
        // Pagination côté client sur les IDs
        const startIdx = params.page * pageSize;
        const endIdx = startIdx + pageSize;
        const pageIds = ids.slice(startIdx, endIdx);
        
        // Récupérer les recipes de cette page (batch de 10 max)
        const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
        const q = query(recipesCollection, where('__name__', 'in', pageIds));
        
        return from(getDocs(q)).pipe(
          map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        );
      }
    });
  }

  public getLatestRecipesResource(count: number = 3) {
    return rxResource<RecipeDto[], unknown>({
      stream: () => {
        const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
        const q = query(
          recipesCollection,
          orderBy('createdAt', 'desc'),
          limit(count)
        );
        
        return from(getDocs(q)).pipe(
          map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        );
      }
    });
  }

  public searchRecipesResource(searchTerm: Signal<string>, categories: Signal<any[] | null>) {
    return rxResource<RecipeDto[], { term: string }>({
      params: () => ({ term: searchTerm() }),
      stream: ({params}) => {
        const term = params.term.toLowerCase().trim();
        
        if (!term) return of([]);
        
        const recipesCollection = collection(this.firestore, 'recipes') as CollectionReference<RecipeDto>;
        const q = query(recipesCollection);
        
        return from(getDocs(q)).pipe(
          debounceTime(500),
          map(snapshot => {
            const allRecipes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const categoriesData = categories();
            
            return allRecipes.filter(recipe => {
              if (recipe.title?.toLowerCase().includes(term)) return true;
              
              if (recipe.description?.toLowerCase().includes(term)) return true;
              
              if (recipe.tags?.some(tag => tag.toLowerCase().includes(term))) return true;
              
              if (categoriesData) {
                const category = categoriesData.find(c => c.id === recipe.categoryID);
                if (category?.name?.toLowerCase().includes(term)) return true;
                if (category?.slug?.toLowerCase().includes(term)) return true;
              }
              
              return false;
            });
          })
        );
      }
    });
  }
}
