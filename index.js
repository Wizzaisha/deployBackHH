
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const {seederCategory} = require("./src/Seeders/category.seeder")
const { seederRole} = require("./src/Seeders/role.seeder")
const {productoSeeder} = require("./src/Seeders/product.seeder")


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}


conn.sync().then(() => {

    server.listen(port, () => {
        console.log(`Listen on port ${port}`);
        seederCategory();
        seederRole();
        productoSeeder();
    });
});