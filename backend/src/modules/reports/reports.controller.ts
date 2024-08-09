import { Controller, Get, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('/admin')
  async getAdminDashboardEmbedUrl() {
    return {
      url: this.reportService.getAdminEmbedUrl(),
    };
  }

  @Get('/member')
  async getMemberDashboardEmbedUrl(@Request() req: any) {
    return {
      url: this.reportService.getMemberEmbedUrl(req.user),
    };
  }
}
