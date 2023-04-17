import { Account, Client } from "appwrite";

const client = new Client();

const account = new Account(client);

client.setProject("coupon_luxury").setEndpoint("https://cloud.appwrite.io/v1");

export default account;
