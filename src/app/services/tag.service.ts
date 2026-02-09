import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private firestore = inject(Firestore);

 tagsResource = rxResource<Tag[], unknown>({
    stream: () => {
      const tagCollection = collection(this.firestore, 'tags') as CollectionReference<Tag>;
      return collectionData<Tag>(tagCollection, { idField: 'id' })
    }
  });
}

