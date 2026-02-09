import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, updateDoc, arrayUnion, arrayRemove, docData } from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';
import { from, Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  usersResource = rxResource<User[], unknown>({
    stream: () => {
      const userCollection = collection(this.firestore, 'users') as CollectionReference<User>;
      console.log('🔍 userCollection', userCollection);
      return collectionData<User>(userCollection, { idField: 'id' })
    }
  });

  /**
   * Récupérer les favoris d'un utilisateur
   */
  getUserFavorites(userId: string): Observable<string[]> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef).pipe(
      map((userData: any) => userData?.favorites || [])
    );
  }

  /**
   * Récupérer le rôle d'un utilisateur
   */
  getUserRole(userId: string): Observable<string> {
    console.log('🔍 getUserRole - userId:', userId);
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef).pipe(
      map((userData: any) => {
        console.log('🔍 getUserRole - userData:', userData);
        const role = userData?.role || 'user';
        console.log('🔍 getUserRole - role:', role);
        return role;
      })
    );
  }

  /**
   * Récupérer les informations complètes d'un utilisateur
   */
  getUserById(userId: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef, { idField: 'id' }) as Observable<User>;
  }

  /**
   * Ajouter une recette aux favoris
   */
  addFavorite(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, {
      favorites: arrayUnion(recipeId)
    }));
  }

  /**
   * Retirer une recette des favoris
   */
  removeFavorite(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, {
      favorites: arrayRemove(recipeId)
    }));
  }

  /**
   * Toggle favori (ajouter si absent, retirer si présent)
   */
  toggleFavorite(userId: string, recipeId: string, isFavorite: boolean): Observable<void> {
    console.info('Toggle - userId:', userId, 'recipeId:', recipeId, 'isFavorite:', isFavorite);
  
    if (isFavorite) {
      // Si c'est déjà en favori, on le retire
      return this.removeFavorite(userId, recipeId);
    } else {
      // Sinon on l'ajoute
      return this.addFavorite(userId, recipeId);
    }
  }
}

