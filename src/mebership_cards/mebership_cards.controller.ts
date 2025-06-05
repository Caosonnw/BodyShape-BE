import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { CreateMembershipCardDto } from '@/mebership_cards/dto/create-membership.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { MebershipCardsService } from './mebership_cards.service';
import { UpdateMembershipCardDto } from '@/mebership_cards/dto/update-membership.dto';

@ApiTags('Membership Cards')
@UseInterceptors(ResponseInterceptor)
@Controller('memberships')
export class MebershipCardsController {
  constructor(private readonly mebershipCardsService: MebershipCardsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-all-membership-cards')
  async getAllMembershipCards() {
    return await this.mebershipCardsService.getAllMembershipCards();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-membership-card-by-id/:membership_card_id')
  @ApiParam({
    name: 'membership_card_id',
    description: 'Membership Card ID',
  })
  async getMembershipCardById(
    @Param('membership_card_id', ParseIntPipe) membership_card_id: number,
  ) {
    return await this.mebershipCardsService.getMembershipCardById(
      membership_card_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-membership-card-by-user-id/:user_id')
  @ApiParam({
    name: 'user_id',
    description: 'User ID',
  })
  async getMembershipCardByUserId(
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return await this.mebershipCardsService.getMembershipCardByUserId(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Post('create-membership-card')
  async createMembershipCard(
    @Body() createMembershipCardDto: CreateMembershipCardDto,
  ) {
    return await this.mebershipCardsService.createMembershipCard(
      createMembershipCardDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Put('update-membership-card/:card_id')
  @ApiParam({
    name: 'card_id',
    description: 'Membership Card ID',
  })
  async updateMembershipCard(
    @Param('card_id', ParseIntPipe) cardId: number,
    @Body() updateMembershipCardDTO: UpdateMembershipCardDto,
  ) {
    return await this.mebershipCardsService.updateMembershipCard(
      cardId,
      updateMembershipCardDTO,
    );
  }
}
