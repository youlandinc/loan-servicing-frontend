import { PipelineStatusEnum } from '@/types/enum';

export interface IAomInfo {
  propertyFullAddress: string;
  repaymentStatusEnum: PipelineStatusEnum;
  loanId: number;
  downloadId: number;
  systemLoanNumber: string;
  totalLoanAmount: number;
  monthlyPayment: number;
  firstPaymentDate: string;
  interestRate: number;
  maturityDate: string;
  recordedDate: string;
  instrumentNumber: string;
  investorId: string;
  investorName: string;
  fileInfo: {
    originalFileName: string;
    fileName: string;
    url: string;
    uploadTime: string;
    contentType: string;
    source: 0;
    username: string;
    userId: string;
  };
}

export interface CreateAomPdfParam {
  loanId: number;
  recordedDate: string;
  instrumentNumber: string;
  investorId: number;
  investorName: string;
}
