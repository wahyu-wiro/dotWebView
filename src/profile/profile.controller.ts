import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Render, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get()
    @Render('profiles/index')
    async root(){
        return { message: 'Hello world!' };     
    }

}
