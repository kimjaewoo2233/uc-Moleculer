import type { Context, ServiceSchema } from "moleculer";
import type { ApiSettingsSchema, GatewayResponse, IncomingRequest, Route } from "moleculer-web";
import ApiGateway from "moleculer-web";
import { started } from "../moleculer.config";
import TypeORMDataSource from "../src/typeorm.config";

interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

const ApiService: ServiceSchema<ApiSettingsSchema> = {
	name: "api",
	mixins: [ApiGateway],
	
	settings: {
		port: process.env.PORT != null ? Number(process.env.PORT) : 4000, //서비스가 수신할 포트
		ip: "0.0.0.0", // 서비스가 수신할 ip
		use: [],
		routes: [
			{
				path: "/api",
				whitelist: ["**"],
				use: [],
				mergeParams: true,
				authentication: false,
				authorization: false,
				aliases: {
					"POST /login" : "auth.login"
				},
				callOptions: {},
				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},
				mappingPolicy: "all", // Available values: "all", "restrict"
				logging: true,
			},
		],

		

		log4XXResponses: false,
		logRequestParams: null,
		logResponseData: null,
		assets: {
			folder: "public",
			options: {},
		},
	},
	async started() {
		await TypeORMDataSource.initialize();
		this.logger.info("Type ORM initialized");
	},
	async stopped() {
		await TypeORMDataSource.destroy();
		this.logger.info("Type ORM Destroyed")
	},
	methods: {
		authenticate(
			ctx: Context,
			route: Route,
			req: IncomingRequest,
		): Record<string, unknown> | null {
			const auth = req.headers.authorization;
			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);
				if (token === "123456") {
					return { id: 1, name: "John Doe" };
				}
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					null,
				);
			} else {
				return null;
			}
		},

		authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			const { user } = ctx.meta;
			if (req.$action.auth === "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
			}
		},
	},
};

export default ApiService;
