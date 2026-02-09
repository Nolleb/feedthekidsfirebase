import { Category } from "../../models/category.model";
import { Tag } from "../../models/tag.model";
import { User } from "../../models/user.model";

export interface GlobalSlice {
    categories: Category[] | null;
    tags: Tag[] | null;
    users: User[] | null;
}

export const InitialGlobalSlice: GlobalSlice = {
    categories: null,
    users: null,
    tags: null,
};
