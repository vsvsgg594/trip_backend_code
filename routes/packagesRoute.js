import express from 'express';
import {packageController,getAllPackages,deletePackage} from '../controller/packageController.js';
import {uploadFields } from '../utils/multerConfig.js'
const router=express.Router();

router.post('/package',uploadFields,packageController);
router.get("/package",getAllPackages);
router.delete('/package/:packageId',deletePackage);


export default router;