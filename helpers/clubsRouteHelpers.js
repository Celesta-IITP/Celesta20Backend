const Joi=require('joi');

module.exports={

    validateBody: (schema)=>{
        return (req,res,next)=>{
            
            const result=Joi.validate(req.body,schema);
            if(result.error){
                return res.status(400).json(result.error)
            }
            if(!req.value){
                req.value={}
            }
            req.value['body']=result.value;
            next();
        }
    },
    
    //valiadtion schemas
    schemas: {
        clubSchema: Joi.object().keys({
            name: Joi.string(),
            bio: Joi.string(),
            description: Joi.string(),
            followers: Joi.number(),
            coordinators: Joi.array(),
            subCoordinators: Joi.array(),
            pages: Joi.array(),
            website: Joi.string(),
            image: Joi.string()
        }).unknown(true)
    }
}