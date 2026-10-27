export type Role = 'Supervisor' | 'Quality Lead' | 'Ops Head';

export type ChangeCategory = 'Man' | 'Machine' | 'Material' | 'Method';

export type ChangeReason =
  | 'Tool / insert'
  | 'Breakdown'
  | 'Operator / shift'
  | 'Method change'
  | 'Die or fixture'
  | 'Setting / parameter'
  | 'Material or lot'
  | 'Other';

export type ChangeType = 'Planned' | 'Unplanned';

export type ContainmentChoice =
  | 'Hold the line'
  | 'Run 100% inspection'
  | 'Run normal after first-off acceptance';

export type ImpactAssessment = 'Minor' | 'Moderate' | 'Major' | 'Critical';

export type TriStateDecision = 'Yes' | 'No' | 'To be determined';

export type CaseStatus =
  | 'Pending Quality Review'
  | 'Returned for Correction'
  | 'Pending Ops Approval'
  | 'Returned for Rework'
  | 'Awaiting Implementation Proof'
  | 'Proof Review Pending'
  | 'Proof Returned for Rework'
  | 'Proof Approval Pending'
  | 'Ready for Closure'
  | 'Closed';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  dataUrl: string;
  uploadedAt: string;
  source: 'camera' | 'upload';
  sizeFormatted?: string;
}

export interface WorkflowHistoryItem {
  id: string;
  timestamp: string;
  stage: string;
  actor: string;
  actorRole: Role;
  action: string;
  comment?: string;
  attachmentName?: string;
}

export interface CaseReview {
  reviewedBy?: string;
  reviewedAt?: string;
  containmentChoice?: ContainmentChoice;
  containmentComment?: string;
  impactAssessment?: ImpactAssessment;
  suspectQuantity?: number | '';
  ppapRequired?: TriStateDecision;
  requiredActions?: string;
  actionOwner?: string;
  actionDueDate?: string;
  qualityComment?: string;
}

export interface CaseApproval {
  approvedBy?: string;
  approvedAt?: string;
  opsDecision?: 'approved' | 'returned_for_rework';
  opsComment?: string;
  proofRequired?: boolean; // true = Yes — Proof Required, false = No — No Additional Proof
}

export interface CaseProof {
  submittedBy?: string;
  submittedAt?: string;
  attachment?: Attachment;
  supervisorNotes?: string;
  qualityStatus?: 'pending' | 'accepted' | 'returned';
  qualityComment?: string;
  qualityReviewedAt?: string;
  opsStatus?: 'pending' | 'approved';
  opsComment?: string;
  opsReviewedAt?: string;
}

export interface CaseClosure {
  closedBy?: string;
  closedAt?: string;
  requiredActionsCompleted: boolean;
  controlPlanUpdate: TriStateDecision;
  pfmeaUpdate: TriStateDecision;
  closureComment: string;
}

export interface Case4M {
  id: string;
  entryMethod: 'physical' | 'digital';
  createdAt: string;
  status: CaseStatus;
  currentOwner: Role;
  reporterName: string;
  reporterEmployeeId: string;
  machineLine: string;
  partNumber: string;
  category: ChangeCategory;
  reason: ChangeReason;
  changeType: ChangeType;
  description: string;
  remarks?: string;
  physicalAttachment?: Attachment;
  supportingAttachment?: Attachment;
  review: CaseReview;
  approval: CaseApproval;
  proof?: CaseProof;
  closure?: CaseClosure;
  history: WorkflowHistoryItem[];
}
