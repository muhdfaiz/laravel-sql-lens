export default {
	namespaced: true,
	state: {
		sqlQueries: [],
	},
	mutations: {
		/**
		 * Empty sqlQueries state.
		 *
		 * @param state
		 */
		emptySqlQueries(state:any): void {
			state.sqlQueries = [];
		},
		/**
		 * Empty sqlQueries state.
		 *
		 * @param state
		 * @param query
		 */
		pushNewSqlQueries(state: any, query: Array<any>): void {
			state.sqlQueries.unshift(query);
		},
	},
};
