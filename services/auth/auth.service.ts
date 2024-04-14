import { Context, Service, ServiceBroker } from "moleculer";
import TypeORMDataSource from "@/typeorm.config";


export default class AuthSerivce extends Service {
    constructor(broker: ServiceBroker) {
        super(broker);

        this.parseServiceSchema({
            name: "auth",
            actions: {
                login: {
                    // rest: 'POST /login',
                    params : {
                        username: { type: "string" },
                        password: { type: "string" }
                    },
                    handler(ctx: Context<{ username: string, password: string }>){
                        const { username, password } = ctx.params;

                        if(username === "admin" && password === "admin") {
                            return { token: "토큰", message: "로그인 성공" }
                        } else {
                            throw new Error('계정 틀림');
                        }
                    }
                }
            },
            async started() {
                await TypeORMDataSource.initialize();
                this.logger.info("Type ORM initialized");
            },
            async stopped() {
                await TypeORMDataSource.destroy();
                this.logger.info("Type ORM Destroyed")
            },
    
        })
    }
}