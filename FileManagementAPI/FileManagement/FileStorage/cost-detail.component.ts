import { Component, OnInit, Input } from '@angular/core';
import { DashboardControlMetadata } from 'src/app/features/home/dashboard/models/DashboardControlMetadata';
import { DashboardControlDTO } from 'src/app/features/home/dashboard/models/DashboardControlDTO';
import { ICloudData } from 'src/app/core/models/cloud/ICloudData';
import { ApiDashboardService } from 'src/app/core/services/apiService/dashboard/api-dashboard.service';
import { CostDetailDTO } from './models/CostDetailDTO';
import { CostDetail } from './models/CostDetail';
import { WidgetComponent } from '../../model/WidgetComponent';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlContentMappingService } from 'src/app/core/services/controlContentMapping/control-content-mapping.service';
import { DateService } from 'src/app/core/helpers/dateService/date.service';
import { PromiseService } from 'src/app/core/helpers/promiseService/promise.service';

@Component({
  selector: 'app-cost-detail',
  templateUrl: './cost-detail.component.html',
  styleUrls: ['./cost-detail.component.css']
})
export class CostDetailComponent implements OnInit, WidgetComponent {

  @Input() control: DashboardControlDTO;
  @Input() metadata: DashboardControlMetadata;
  insightData: ICloudData;
  isRendering: boolean;
  protected ngUnsubscribe: Subject<void>;

  current: CostDetail;//previous cost details  - max,min,avg
  diff: CostDetail;//difference between current cost and previous cost details  - max,min,avg
  isPreviousExist: boolean;
  isCurrentExist: boolean;
  metadataIsInvalid: boolean;
  insightDataCancelId: number;
  previous: CostDetail;//previous cost details  - max,min,avg
  
  constructor(
    private apiDashboardService: ApiDashboardService,
    private controlContentService: ControlContentMappingService,
    private dateService: DateService,
    private promiseService: PromiseService
  ) {

  }
  async resetWidgetData() {
    await this.setCostDetailData();
  }

  async ngOnInit() {
    await this.setCostDetailData();
  }

  async setCostDetailData() {
    if (this.control) {
      try {
        this.metadataIsInvalid = false;
        this.isRendering = true;
        //because we don't have enough,final data for the last two days
        let endDate = this.dateService.addDays(new Date(), -2);
        const startDate = new Date(this.metadata.insightBody.startDate);
        endDate = endDate >= startDate ? endDate : startDate;
        this.controlContentService.changeInsightBodyCurrentDate(this.metadata, { endDate, startDate });
        const insightData$ = this.apiDashboardService
          .getDashboardControlInsightData(this.metadata.id, this.metadata.insightBody);
        this.insightDataCancelId = this.insightDataCancelId || this.promiseService.getApiCancelNumber();
        let insightData = await this.promiseService.apiToPromise(insightData$, this.insightDataCancelId);
        this.insightData = insightData;
        this.setCurrentValues();
        this.setPreviousValues();
      } catch (err) {
        this.metadataIsInvalid = true;
      } finally {
        this.isRendering = false;
      }
    }
  }

  mapCostDetailDto(cost: CostDetailDTO): CostDetail {
    return {
      avgTotalCost: cost.avgTotalCost || 0,
      maxTotalCost: this.parseStringToNumber(cost.maxTotalCost) || 0,
      minTotalCost: this.parseStringToNumber(cost.minTotalCost) || 0,
    };
  }

  parseStringToNumber(str: string): number {
    try {
      return Number.parseFloat(str);
    } catch {
      return 0;
    }
  }

  private setPreviousValues() {
    this.isPreviousExist = this.insightData.previousUsage && this.insightData.previousUsage[0] ? true : false;
    if (this.isPreviousExist) {
      const previous = this.mapCostDetailDto(this.insightData.previousUsage[0]);
      this.previous = previous;
      this.previous.avgTotalCost = Number.parseFloat(this.setCostToTwoDecimalPoint(this.previous.avgTotalCost));
      this.previous.maxTotalCost = Number.parseFloat(this.setCostToTwoDecimalPoint(this.previous.maxTotalCost));
      this.previous.minTotalCost = Number.parseFloat(this.setCostToTwoDecimalPoint(this.previous.minTotalCost));
      const diffMax = this.setCostDiff(this.current.maxTotalCost, previous.maxTotalCost);
      const diffAvg = this.setCostDiff(this.current.avgTotalCost, previous.avgTotalCost);
      const diffMin = this.setCostDiff(this.current.minTotalCost, previous.minTotalCost);
      this.diff = {
        maxTotalCost: diffMax,
        minTotalCost: diffMin,
        avgTotalCost: diffAvg
      };
    }
  }

  setCostDiff(currentValue: number, previousValue: number): number {
    if (currentValue && previousValue) {
      return (currentValue - previousValue) / previousValue * -100;
    }
    return undefined;
  }

  private setCurrentValues() {
    this.isCurrentExist = this.insightData.currentUsage && this.insightData.currentUsage[0] ? true : false;
    if (this.isCurrentExist) {
      const cost: CostDetailDTO = this.insightData.currentUsage[0];
      this.current = this.mapCostDetailDto(cost);
      if (!this.current.avgTotalCost && !this.current.maxTotalCost && !this.current.minTotalCost) {
        throw new Error("no current data for cost detail widget");
      }
    }
    else {
      this.metadataIsInvalid = true;
    }
  }
  private setCostByTotal(total: number): number {
    if (total) {
      const amount = total;
      const amountInt = Math.round(amount * 100);
      return amountInt / 100;
    }
    return undefined;
  }

  setCostToTwoDecimalPoint(num: number) {
    if (!num)
      return;
    num = this.setCostByTotal(num);
    let str = num.toString();
    if (!str.match(/(\.)/g)) {
      return str;
    }
    str = str.match(/(\.\d)$/g) ? str + "0" : str;
    return str;
  }

}


