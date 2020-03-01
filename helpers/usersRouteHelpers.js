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

    validateBodySignUp: (schema)=>{
        return (req,res,next)=>{
            const instituteId=req.body.instituteId;
            if(instituteId) {
                req.body.batch=instituteId.substring(0,4);
                req.body.branch=instituteId.slice(4,6);
                req.body.rollno=instituteId.substring(6);
            }

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

    validateBodySignIn: (schema)=>{
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
        authSchemaSignIn: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
        authSchemaSignUp: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            isSuperUser: Joi.boolean(),
            por: Joi.array(),
            instituteId: Joi.string().required(),
            batch: Joi.string(),
            branch: Joi.string(),
            phone:Joi.string(),
            rollno: Joi.string(),
            code: Joi.number(),
            active: Joi.number()
        }),
        userSchemaPatch: Joi.object().keys({
            email: Joi.string().email(),
            password: Joi.string(),
            name: Joi.string(),
            isSuperUser: Joi.boolean(),
            por: Joi.array(),
            instituteId: Joi.string(),
            batch: Joi.string(),
            branch: Joi.string(),
            phone:Joi.string(),
            rollno: Joi.string(),
            code: Joi.number(),
            active: Joi.number()
        }),
    }
}