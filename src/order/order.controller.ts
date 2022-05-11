import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FormDataRequest } from 'nestjs-form-data';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/role.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrderDto } from './dtos/get-order.dto';
import { UpdateStatusOrderDto } from './dtos/update-status.dto';
import {OrderService} from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService
    ){}

    @UseGuards(AuthGuard())
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Patch(':id')
    @FormDataRequest()
    async updateStatusOrder(@Param('id') id:string, @Body() updateStatusOrderDto: UpdateStatusOrderDto){        
        
        return await this.orderService.updateStatusOrder(id, updateStatusOrderDto)
    }
    
    @UseGuards(AuthGuard())
    @Roles( Role.SUPERADMIN)
    @Delete(':id')
    async deleteOrder(@Param('id') id: string){
        return await this.orderService.deleteOrder(id);
    }

    @UseGuards(AuthGuard())
    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User){    
        // console.log('dto',createOrderDto);
            
        return await this.orderService.createOrder(createOrderDto, user)
    }



    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get()
    async getAllOrder(@Body() getOrderDto: GetOrderDto, @GetUser() user: User){
        return await this.orderService.getAllOrder(getOrderDto,user)
    }

    @UseGuards(AuthGuard())
    @Get('/mine')
    async getOrderByUser(@Body() getOrderDto: GetOrderDto, @GetUser() user: User){
        return await this.orderService.getOrderByUser(getOrderDto,user)
    }
    
  
 
   
}
