// // import { TemplateTable } from "@/app/api/types";
// // import { Dao } from "@/db/schema/dao";
// // import { Template } from "@/db/schema/template";
// import { User } from '@/db/schema/user'
// export interface fetchTemplatesParams {
//     offset: number,
//     orderBy?: "asc" | "desc",
//     limit?: number
// }

// export interface fetchTemplatesDetailParams {
//     id: number,
// }

// export interface TemplatesData extends Template {
//     count?: number
//     first_name?: string
//     last_name?: string
// }

// export interface TemplateDetailReponse {
//     user: {
//         picture_url: string | null;
//         created_at: Date | null;
//         last_name: string | null;
//         publicAddress: string | null;
//         user_id: number | null;
//         firstName: string | null;
//     } | null,
//     dao: {
//         created_at: Date | null;
//         Initial_supply: number | null;
//         max_supply: number | null;
//         developerShare: number | null;
//         ownershipEconomyThresholdAmount: number | null;
//         token_name: string | null;
//         dao_address: string | null | undefined,
//         token_address: string | null | undefined,
//         token_symbol: string | null | undefined,
//         creator_user_id: number | null | undefined,
//         dao_blockchain_status: "PENDING" | "STARTED" | "CONFIRMED" | "FAILED" | "MANIPULATED" | null | undefined;
//     } | null
//     ,
//     template: {
//         title: string | null;
//         templateId: number;
//         picture_url: string | null;
//         description: string | null;
//         price: number | null;
//         no_of_sales: number | null;
//         created_at: Date | null;
//     }
//     category: { name: string, id: string }[]
// }

// export interface IProfileData {
//     entity_id: number;
//     first_name: string;
//     last_name: string;
//     email: string;
//     publicAddress: string,
//     created_at: string
// }

// export interface TemplateData {
//     category: { name: string; id: number }[];
//     dao: Dao;
//     template: Template;
//     user: User;
// }

export interface UserType {
    publicAddress: string;
    display_name: string;
    emailVerified: boolean;
    id: string;
    email: string;
    profile_image: string;
    cover_image: string;
    creation_date: string;
}

