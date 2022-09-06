import './config'
import { migrateFiles } from './handlers'
import { CronType, CronMaster} from './cron-master'

const app = new CronMaster([{
  funName: migrateFiles,
  cronType: CronType.EVERY_MINUTE
}]);