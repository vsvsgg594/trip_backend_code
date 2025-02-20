import express from 'express';
import {packageController,getAllPackages,deletePackage,getPackagesById} from '../controller/packageController.js';
import {uploadFields } from '../utils/multerConfig.js'
const router=express.Router();

router.post('/package',uploadFields,packageController);
router.get("/package",getAllPackages);
router.delete('/package/:packageId',deletePackage);
router.get('/package/:packagesId',getPackagesById);


export default router;