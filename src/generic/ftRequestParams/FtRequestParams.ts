import { number } from "zod";

type SortEntries<K extends string = string> = { param: K, ascending: boolean }[];
type FilterEntries<K extends string = string> = Record<K, (string | number | boolean)[]>;
type RangeEntries<K extends string = string> = Record<K, { min: number, max: number }>;

export default class FtRequestParams {
	protected sortEntries: SortEntries = [];
	protected filterEntries: FilterEntries = {};
	protected rangeEntries: RangeEntries = {};
	constructor() { }

	sort(param: string, ascending: boolean = false) {
		this.sortEntries.push({ param, ascending });
		return this;
	}

	filter(param: string, value: string | number | boolean) {
		this.filterEntries[param].push(value);
		return this;
	}

	range(param: string, min: number, max: number) {
		this.rangeEntries[param] = { min, max };
		return this;
	}

	toString() {
		const searchParams = new URLSearchParams();
		searchParams.append("sort", this.sortEntries.map(sortEntry => sortEntry.ascending ? `-${sortEntry.param}`: sortEntry.param).join(","));
		for (const param in this.filterEntries) {
			searchParams.append(`filter[${param}]`, this.filterEntries[param].toString());
		}
		for (const param in this.rangeEntries) {
			searchParams.append(`range[${param}]`, `${this.rangeEntries[param].min},${this.rangeEntries[param].max}`);
		}
	}
}
