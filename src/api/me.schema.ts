import { z } from "zod";

export const meSchema = z.object({
	id: z.null(),
	email: z.string(),
	login: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	usual_full_name: z.string(),
	usual_first_name: z.string().nullable(),
	url: z.string(),
	phone: z.string(),
	displayname: z.string(),
	kind: z.string(),
	image: z.object({
		link: z.string(),
		versions: z.object({
			large: z.string(),
			medium: z.string(),
			small: z.string(),
			micro: z.string()
		})
	}),
	"staff?": z.boolean(),
	correction_point: z.number(),
	pool_month: z.string(),
	pool_year: z.string(),
	location: z.null(),
	wallet: z.number(),
	anonymize_date: z.string(),
	data_erasure_date: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	alumnized_at: z.null(),
	"alumni?": z.boolean(),
	"active?": z.boolean(),
	groups: z.array(z.object({ id: z.number(), name: z.string() })),
	cursus_users: z.array(
		z.object({
			id: z.number(),
			begin_at: z.string(),
			end_at: z.string().nullable(),
			grade: z.string().nullable(),
			level: z.number(),
			skills: z.array(
				z.object({ id: z.number(), name: z.string(), level: z.number() })
			),
			cursus_id: z.number(),
			has_coalition: z.boolean(),
			blackholed_at: z.string().nullable(),
			created_at: z.string(),
			updated_at: z.string(),
			user: z.object({
				id: z.number(),
				email: z.string(),
				login: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				usual_full_name: z.string(),
				usual_first_name: z.null(),
				url: z.string(),
				phone: z.string(),
				displayname: z.string(),
				kind: z.string(),
				image: z.object({
					link: z.string(),
					versions: z.object({
						large: z.string(),
						medium: z.string(),
						small: z.string(),
						micro: z.string()
					})
				}),
				"staff?": z.boolean(),
				correction_point: z.number(),
				pool_month: z.string(),
				pool_year: z.string(),
				location: z.null(),
				wallet: z.number(),
				anonymize_date: z.string(),
				data_erasure_date: z.string(),
				created_at: z.string(),
				updated_at: z.string(),
				alumnized_at: z.null(),
				"alumni?": z.boolean(),
				"active?": z.boolean()
			}),
			cursus: z.object({
				id: z.number(),
				created_at: z.string(),
				name: z.string(),
				slug: z.string(),
				kind: z.string()
			})
		})
	),
	projects_users: z.array(
		z.union([
			z.object({
				id: z.number(),
				occurrence: z.number(),
				final_mark: z.number(),
				status: z.string(),
				"validated?": z.boolean(),
				current_team_id: z.number(),
				project: z.object({
					id: z.number(),
					name: z.string(),
					slug: z.string(),
					parent_id: z.null()
				}),
				cursus_ids: z.array(z.number()),
				marked_at: z.string(),
				marked: z.boolean(),
				retriable_at: z.string(),
				created_at: z.string(),
				updated_at: z.string()
			}),
			z.object({
				id: z.number(),
				occurrence: z.number(),
				final_mark: z.null(),
				status: z.string(),
				"validated?": z.null(),
				current_team_id: z.number(),
				project: z.object({
					id: z.number(),
					name: z.string(),
					slug: z.string(),
					parent_id: z.null()
				}),
				cursus_ids: z.array(z.number()),
				marked_at: z.null(),
				marked: z.boolean(),
				retriable_at: z.null(),
				created_at: z.string(),
				updated_at: z.string()
			}),
			z.object({
				id: z.number(),
				occurrence: z.number(),
				final_mark: z.number(),
				status: z.string(),
				"validated?": z.boolean(),
				current_team_id: z.number(),
				project: z.object({
					id: z.number(),
					name: z.string(),
					slug: z.string(),
					parent_id: z.null()
				}),
				cursus_ids: z.array(z.number()),
				marked_at: z.string(),
				marked: z.boolean(),
				retriable_at: z.null(),
				created_at: z.string(),
				updated_at: z.string()
			}),
			z.object({
				id: z.number(),
				occurrence: z.number(),
				final_mark: z.number(),
				status: z.string(),
				"validated?": z.boolean(),
				current_team_id: z.number(),
				project: z.object({
					id: z.number(),
					name: z.string(),
					slug: z.string(),
					parent_id: z.number()
				}),
				cursus_ids: z.array(z.number()),
				marked_at: z.string(),
				marked: z.boolean(),
				retriable_at: z.string(),
				created_at: z.string(),
				updated_at: z.string()
			})
		])
	),
	languages_users: z.array(
		z.object({
			id: z.number(),
			language_id: z.number(),
			user_id: z.number(),
			position: z.number(),
			created_at: z.string()
		})
	),
	achievements: z.array(
		z.union([
			z.object({
				id: z.number(),
				name: z.string(),
				description: z.string(),
				tier: z.string(),
				kind: z.string(),
				visible: z.boolean(),
				image: z.string(),
				nbr_of_success: z.null(),
				users_url: z.string()
			}),
			z.object({
				id: z.number(),
				name: z.string(),
				description: z.string(),
				tier: z.string(),
				kind: z.string(),
				visible: z.boolean(),
				image: z.string(),
				nbr_of_success: z.number(),
				users_url: z.string()
			})
		])
	),
	titles: z.array(z.object({ id: z.number(), name: z.string() })),
	titles_users: z.array(
		z.object({
			id: z.number(),
			user_id: z.number(),
			title_id: z.number(),
			selected: z.boolean(),
			created_at: z.string(),
			updated_at: z.string()
		})
	),
	partnerships: z.array(z.unknown()),
	patroned: z.array(
		z.object({
			id: z.number(),
			user_id: z.number(),
			godfather_id: z.number(),
			ongoing: z.boolean(),
			created_at: z.string(),
			updated_at: z.string()
		})
	),
	patroning: z.array(z.unknown()),
	expertises_users: z.array(
		z.object({
			id: z.number(),
			expertise_id: z.number(),
			interested: z.boolean(),
			value: z.number(),
			contact_me: z.boolean(),
			created_at: z.string(),
			user_id: z.number()
		})
	),
	roles: z.array(z.unknown()),
	campus: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			time_zone: z.string(),
			language: z.object({
				id: z.number(),
				name: z.string(),
				identifier: z.string(),
				created_at: z.string(),
				updated_at: z.string()
			}),
			users_count: z.number(),
			vogsphere_id: z.number(),
			country: z.string(),
			address: z.string(),
			zip: z.string(),
			city: z.string(),
			website: z.string(),
			facebook: z.string(),
			twitter: z.string(),
			active: z.boolean(),
			public: z.boolean(),
			email_extension: z.string(),
			default_hidden_phone: z.boolean()
		})
	),
	campus_users: z.array(
		z.object({
			id: z.number(),
			user_id: z.number(),
			campus_id: z.number(),
			is_primary: z.boolean(),
			created_at: z.string(),
			updated_at: z.string()
		})
	)
});
