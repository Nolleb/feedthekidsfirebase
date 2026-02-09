import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private firestore = inject(Firestore);

  categoriesResource = rxResource<Category[], unknown>({
    stream: () => {
      const categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
      return collectionData<Category>(categoriesCollection, { idField: 'id' })
    }
  });
}

