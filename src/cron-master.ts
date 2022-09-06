import cron from 'node-cron';

export enum CronType {
  EVERY_MINUTE = '* * * * *'
}

export interface ICron {
  funName(now: Date): void;
  cronType: CronType
}

export class CronMaster {

  constructor(private cronsSetup: ICron[]) {
    this.initializeCrons();
  }

  private initializeCrons() {
    this.cronsSetup.forEach((cronSetup) => {
      cron.schedule(cronSetup.cronType, cronSetup.funName)
    })
    console.log('All crons created successfully');
  }
}