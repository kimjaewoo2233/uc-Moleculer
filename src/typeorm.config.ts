import { DataSource } from "typeorm";
import { User } from "@/entities/user.entity";


export const TypeORMDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "woo",
    password: "1234",
    database: "joonbee",
    synchronize: true,
    logging: false,
    entities: [User]
  });

export default TypeORMDataSource;
