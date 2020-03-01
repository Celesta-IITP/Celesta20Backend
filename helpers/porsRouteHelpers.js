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
        porSchema: Joi.object().keys({
            position: Joi.string().required(),
            access: Joi.number()
        }).unknown(true),
        approveSchema: Joi.object().keys({
            porId: Joi.string().required(),
            access: Joi.number().required()
        }).unknown(true)
    }
}