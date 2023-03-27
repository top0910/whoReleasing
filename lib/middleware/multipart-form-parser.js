import  formidable  from  'formidable';
import path from "path"
import getConfig from "next/config"
// 
const  form = formidable({ multiples:  true,uploadDir:path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT,"/public/assets/images/projects")}); // multiples means req.files will be an array
console.log(getConfig().serverRuntimeConfig.PROJECT_ROOT)
export  default  async  function  parseMultipartForm(req, res, next) {
	const  contentType = req.headers['content-type']
	if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
		form.parse(req, (err, fields, files) => {
		if (!err) {
			req.body = fields; // sets the body field in the request object
			req.files = files; // sets the files field in the request object
		}
			next(); // continues to the next middleware or to the route
		})
	} else {
		next();
	}
}