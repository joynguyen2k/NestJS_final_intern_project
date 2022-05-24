import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { CategoryBanner } from 'src/category/entities/category-banner.entity';
import { FsService } from '../fs/fs.service';

@Injectable()

export class CloudinaryService {
  constructor(
    private fsService : FsService
  ){}
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      await v2.uploader.upload(file.path, (err, result) => {
        if (err) reject(err);
        resolve(result);
        this.fsService.deleteOne(file)
      });
    });
  }
  async deleteCategoryBanner(categoryBanner: CategoryBanner[]){
    for(let i =0; i< categoryBanner.length; i++){
      console.log(99999999999999999);
      
      await v2.uploader.destroy(categoryBanner[i].public_id)
    }
  }
  async deleteOne(public_id: string){
    return v2.uploader.destroy(public_id)
  }
}