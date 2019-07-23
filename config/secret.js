module.exports = {
	// database: 'mongodb://Mahmud:Kunley23@ds027425.mlab.com:27425/justtawa',
    database: process.env.DATABASE || "mongodb://localhost/5digital",
    secret: process.env.SECRET || "Lollzzz",
    port: process.env.PORT || 3030,
    sqlDBUserName: "root",
    sqlDBPassword: "root", //2T8Blsuwc96E
    sqlDBUrl: "localhost",
    sqlDBName: "realtor",
    sqlDBPort: 8889
}