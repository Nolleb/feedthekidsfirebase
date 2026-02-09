import {PartialStateUpdater} from "@ngrx/signals";
import { Category } from "../../models/category.model";
import { GlobalSlice } from "./global.slice";
import { User } from "../../models/user.model";
import { Tag } from "../../models/tag.model";

export function updateCategories(categories: Category[]): PartialStateUpdater<GlobalSlice> {
    return state => ({
        ...state,
        categories: categories
    })
}

export function updateUsers(users: User[]): PartialStateUpdater<GlobalSlice> {
    return state => ({
        ...state,
        users: users
    })
}

export function updateTags(tags: Tag[]): PartialStateUpdater<GlobalSlice> {
    return state => ({
        ...state,
        tags: tags
    })
}
