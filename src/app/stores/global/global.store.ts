import {
    patchState,
    signalStore,
    watchState,
    withComputed,
    withHooks,
    withMethods,
    withProps,
    withState
} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {withDevtools, withLocalStorage, withStorageSync} from '@angular-architects/ngrx-toolkit';
import { updateCategories, updateTags, updateUsers } from './global.updater';
import { Category } from '../../models/category.model';
import { InitialGlobalSlice } from './global.slice';
import { CategoryService } from '../../services/categories.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';
import { reload } from '@angular/fire/auth';

// Create the SignalStore
export const GlobalStore = signalStore(
    {providedIn: 'root'},

    // Add state
    withState(InitialGlobalSlice),
    withProps(() => ({
        _categoryService: inject(CategoryService),
        _userService: inject(UserService),
        _tagService: inject(TagService),
    })),

    withProps((store) => ({
        _categories: store._categoryService.categoriesResource,
        _users: store._userService.usersResource,
        _tags: store._tagService.tagsResource,
    })),

    // Add computed values (like selectors)
    withComputed((store) => {

        const categoriesLoading = computed(() => store._categories.isLoading());
        const categoriesHasValue = computed(() => store._categories.hasValue());
        const categories = computed(() => store._categories.value() ? store._categories.value() : null);
        const error = computed(() => store._categories.error());
        const hasError = computed(() => !!error())

        return {
            categoriesLoading,
            error,
            hasError,
            categoriesHasValue,
            categories
        };
    }),

    // Add methods (like actions)
    withMethods((store) => ({
        reloadCategories() {
            store._categories.reload();
        }
    })),

    withHooks({
        onInit(store) {

            effect(() => {
                const usersRes = store._users;

                if (!usersRes.hasValue()) return;

                const users = usersRes.value() as User[];
                patchState(store, updateUsers(users));
            });

            effect(() => {
                const tagRes = store._tags;

                if (!tagRes.hasValue()) return;

                const tags = tagRes.value() as Tag[];
                patchState(store, updateTags(tags));
            });
        },
    }),

    // Sync state to localStorage
     withStorageSync(
        {
            key: 'globalStore',
            select: ({categories, users}) => ({categories, users}),
        },
        
        withLocalStorage()
    ), 

    withDevtools('GlobalStore')
);
