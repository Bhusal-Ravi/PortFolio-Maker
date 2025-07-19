const GoogleStrategy= require('passport-google-oauth20').Strategy
const passport= require('passport');
const User= require('./models/User')


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret:  process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
             scope:["profile","email"],
        },
        async function(accessToken,refreshToken,profile,done){
            try{
                console.log('Google profile:', profile.id, profile.displayName, profile.emails[0].value);
                const existingUser = await User.findOne({googleId:profile.id});
                if(existingUser){
                    return done (null,existingUser);
                }
                const newUser= await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0].value
                })
                  return done(null, newUser);
            }catch(err){
                console.error('Passport strategy error:', err);
                return done(err, null);
            }
        }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})