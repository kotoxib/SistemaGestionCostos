import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

export const PRIMENG_MODULES = [
  SelectModule,
  MultiSelectModule,
  InputTextModule,
  TableModule,
  ButtonModule,
  TooltipModule,
  DynamicDialogModule,
  DatePickerModule,
  PaginatorModule,
  FileUploadModule,
  DialogModule,
  ToastModule,
  TagModule,
  CardModule,
  ProgressBarModule,
  AccordionModule,
  TextareaModule,
  InputNumberModule,
  CheckboxModule,
] as const;
