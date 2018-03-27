module.exports.showHome = async(ctx) => {
    ctx.state.user = {     
        nickName:"Lemon",
        age:21
    }
    await ctx.render('index')   
}

module.exports.getDate = async(ctx) => {
	let {username,password} = ctx.request.body
    ctx.body = {
        username:username,
        password:password
    }
    console.log(`username:${username}`)
    console.log(`password:${password}`)
}

module.exports.meta ={
    getDate:{
        url:'/login',
        methods:['post'],
        bodyParser:true
    }
 }