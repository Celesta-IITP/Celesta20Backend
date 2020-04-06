const Joi=require('joi');

module.exports={

    validateBody: (schema)=>{
        return (req,res,next)=>{
            const result=Joi.validate(req.body,schema);
            if(result.error){
                return res.status(400).send(result.error)
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
        gallerySchema: Joi.object().keys({
            caption: Joi.string(),
            imageUrl: Joi.string().required(),
            thumbnailUrl: Joi.string()
        }).unknown(false),
        patchSchema: Joi.object().keys({
            caption: Joi.string(),
            imageUrl: Joi.string(),
            thumbnailUrl: Joi.string()
        }).unknown(false),
    }
}