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
        eventSchema: Joi.object().keys({
            organizers: Joi.array(),
            name: Joi.string().required(),
            description: Joi.string(),
            imageUrl: Joi.string(),
            venue: Joi.string(),
            venueUrl: Joi.string(),
            date: Joi.string(),
            startTime: Joi.string(),
            endTime: Joi.string(),
            teamSize: Joi.number(),
            eventType: Joi.string(),
            rulebookUrl: Joi.string(),
            charge: Joi.number(),
            postLinks: Joi.array()
        }).unknown(false),

    }
}