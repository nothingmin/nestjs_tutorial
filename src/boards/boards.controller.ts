import {
    Body,
    Get,
    Post,
    Controller,
    Param,
    Delete,
    Patch,
    ValidationPipe,
    UsePipes,
    ParseIntPipe, UseGuards, Logger
} from '@nestjs/common';
import {BoardStatus} from './board-status.enum';
import {BoardsService} from './boards.service';
import {CreateBoardDto} from "./dto/crate.board.dto";
import {Board} from "./board.entity";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decoration";
import {User} from "../auth/user.entity";
import {BoardStatusValidationPipe} from "./pipes/board-status-validation.pipe";

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('BoardController');
    constructor(private boardsService: BoardsService) {
    }

    @Get()
    getAllBoard(
        @GetUser() user: User,
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get boards`)
        return this.boardsService.getAllBoards(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    crateBoard(@Body() createBoardDto: CreateBoardDto,
               @GetUser() user: User
    ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto, user)
    }

    @Get('/:id')
    getBoardById(@Param('id', ParseIntPipe) id: number) {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoardById(@Param('id') id: number,
        @GetUser() user: User): Promise<void> {
        return this.boardsService.deleteBoard(id, user);
    }

    @Patch('/:id/status')
    updateBoardStatus(@Param('id', ParseIntPipe) id: number,
                      @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
        return this.boardsService.updateBoardStatus(id, status);
    }
}
