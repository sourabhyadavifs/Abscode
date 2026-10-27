import React, { useState } from 'react';
import {
  Case4M,
  ChangeCategory,
  ChangeReason,
  ChangeType,
  ContainmentChoice,
  ImpactAssessment,
  Role,
  TriStateDecision,
  Attachment,
} from '../types';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { AttachmentUploader } from '../components/AttachmentUploader';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  Layers,
  User,
  ArrowRight,
  Eye,
  Camera,
  XCircle,
  HelpCircle,
  History,
} from 'lucide-react';

interface CaseDetailViewProps {
  currentCase: Case4M;
  currentRole: Role;
  onUpdateCase: (updatedCase: Case4M) => void;
  onBack: () => void;
  onSwitchRole: (role: Role) => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  currentCase,
  currentRole,
  onUpdateCase,
  onBack,
  onSwitchRole,
}) => {
  // Quality Review State
  const [containmentChoice, setContainmentChoice] = useState<ContainmentChoice>(
    currentCase.review.containmentChoice || 'Hold the line'
  );
  const [containmentComment, setContainmentComment] = useState<string>(
    currentCase.review.containmentComment || ''
  );
  const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>(
    currentCase.review.impactAssessment || 'Moderate'
  );
  const [suspectQuantity, setSuspectQuantity] = useState<number | ''>(
    currentCase.review.suspectQuantity ?? 0
  );
  const [ppapRequired, setPpapRequired] = useState<TriStateDecision>(
    currentCase.review.ppapRequired || 'No'
  );
  const [requiredActions, setRequiredActions] = useState<string>(
    currentCase.review.requiredActions || ''
  );
  const [actionOwner, setActionOwner] = useState<string>(
    currentCase.review.actionOwner || ''
  );
  const [actionDueDate, setActionDueDate] = useState<string>(
    currentCase.review.actionDueDate || ''
  );
  const [qualityReturnComment, setQualityReturnComment] = useState<string>('');
  const [showQualityReturnModal, setShowQualityReturnModal] = useState<boolean>(false);

  // Structured details extraction for physical forms
  const [confirmedMachine, setConfirmedMachine] = useState<string>(
    currentCase.machineLine === 'Pending Quality extraction'
      ? 'Press-04 (Line B)'
      : currentCase.machineLine
  );
  const [confirmedPart, setConfirmedPart] = useState<string>(
    currentCase.partNumber === 'Pending Quality extraction'
      ? 'BRK-204'
      : currentCase.partNumber
  );
  const [confirmedCategory, setConfirmedCategory] = useState<ChangeCategory>(
    currentCase.category || 'Machine'
  );
  const [confirmedReason, setConfirmedReason] = useState<ChangeReason>(
    currentCase.reason || 'Tool / insert'
  );
  const [confirmedChangeType, setConfirmedChangeType] = useState<ChangeType>(
    currentCase.changeType || 'Unplanned'
  );

  // Supervisor Correction State
  const [correctedDescription, setCorrectedDescription] = useState<string>(
    currentCase.description
  );
  const [correctionSupervisorNote, setCorrectionSupervisorNote] = useState<string>('');

  // Ops Approval State
  const [showOpsApprovalModal, setShowOpsApprovalModal] = useState<boolean>(false);
  const [opsReturnComment, setOpsReturnComment] = useState<string>('');
  const [showOpsReturnModal, setShowOpsReturnModal] = useState<boolean>(false);

  // Implementation Proof State (Supervisor)
  const [proofAttachment, setProofAttachment] = useState<Attachment | undefined>(
    currentCase.proof?.attachment
  );
  const [proofNotes, setProofNotes] = useState<string>(
    currentCase.proof?.supervisorNotes || ''
  );
  const [proofReviewComment, setProofReviewComment] = useState<string>('');
  const [showProofReturnModal, setShowProofReturnModal] = useState<boolean>(false);

  // S5 Closure State
  const [actionsCompleted, setActionsCompleted] = useState<boolean>(
    currentCase.closure?.requiredActionsCompleted ?? false
  );
  const [controlPlanUpdate, setControlPlanUpdate] = useState<TriStateDecision>(
    currentCase.closure?.controlPlanUpdate || 'Yes'
  );
  const [pfmeaUpdate, setPfmeaUpdate] = useState<TriStateDecision>(
    currentCase.closure?.pfmeaUpdate || 'No'
  );
  const [closureComment, setClosureComment] = useState<string>(
    currentCase.closure?.closureComment || ''
  );
  const [closureValidationMsg, setClosureValidationMsg] = useState<string | null>(null);

  // Attachment preview lightbox
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string | null>(null);

  const nowFormatted = () => new Date().toISOString().replace('T', ' ').slice(0, 16);

  // --------------------------------------------------------------------------
  // ACTIONS: Quality Lead Review Handlers
  // --------------------------------------------------------------------------
  const handleSaveQualityDraft = () => {
    const updated: Case4M = {
      ...currentCase,
      machineLine: confirmedMachine,
      partNumber: confirmedPart,
      category: confirmedCategory,
      reason: confirmedReason,
      changeType: confirmedChangeType,
      review: {
        ...currentCase.review,
        reviewedBy: 'Quality Lead (Draft)',
        reviewedAt: nowFormatted(),
        containmentChoice,
        containmentComment,
        impactAssessment,
        suspectQuantity,
        ppapRequired,
        requiredActions,
        actionOwner,
        actionDueDate,
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Quality Review',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Saved assessment draft',
          comment: 'Assessment fields updated and saved.',
        },
      ],
    };
    onUpdateCase(updated);
  };

  const handleReturnToSupervisor = () => {
    if (!qualityReturnComment.trim()) return;

    const updated: Case4M = {
      ...currentCase,
      status: 'Returned for Correction',
      currentOwner: 'Supervisor',
      review: {
        ...currentCase.review,
        reviewedBy: 'Vikram Mehta (Quality Lead)',
        reviewedAt: nowFormatted(),
        containmentChoice,
        containmentComment,
        qualityComment: qualityReturnComment.trim(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Quality Review',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Returned request for correction',
          comment: qualityReturnComment.trim(),
        },
      ],
    };

    onUpdateCase(updated);
    setShowQualityReturnModal(false);
  };

  const handleSendForApproval = () => {
    const updated: Case4M = {
      ...currentCase,
      machineLine: confirmedMachine,
      partNumber: confirmedPart,
      category: confirmedCategory,
      reason: confirmedReason,
      changeType: confirmedChangeType,
      status: 'Pending Ops Approval',
      currentOwner: 'Ops Head',
      review: {
        ...currentCase.review,
        reviewedBy: 'Vikram Mehta (Quality Lead)',
        reviewedAt: nowFormatted(),
        containmentChoice,
        containmentComment,
        impactAssessment,
        suspectQuantity,
        ppapRequired,
        requiredActions,
        actionOwner,
        actionDueDate,
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Quality Review',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Quality review completed & sent for Ops Approval',
          comment: `Containment: ${containmentChoice}. Impact: ${impactAssessment}. PPAP: ${ppapRequired}.`,
        },
      ],
    };

    onUpdateCase(updated);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Supervisor Correction Handler
  // --------------------------------------------------------------------------
  const handleResubmitCorrection = () => {
    const updated: Case4M = {
      ...currentCase,
      description: correctedDescription.trim(),
      status: 'Pending Quality Review',
      currentOwner: 'Quality Lead',
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Correction Resubmission',
          actor: `${currentCase.reporterName} (${currentCase.reporterEmployeeId})`,
          actorRole: 'Supervisor',
          action: 'Updated and resubmitted 4M request',
          comment:
            correctionSupervisorNote.trim() || 'Addressed Quality Lead clarification questions.',
        },
      ],
    };

    onUpdateCase(updated);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Ops Head Approval Handlers
  // --------------------------------------------------------------------------
  const handleOpsDecision = (proofRequired: boolean) => {
    const nextStatus = proofRequired ? 'Awaiting Implementation Proof' : 'Ready for Closure';
    const nextOwner: Role = proofRequired ? 'Supervisor' : 'Quality Lead';

    const updated: Case4M = {
      ...currentCase,
      status: nextStatus,
      currentOwner: nextOwner,
      approval: {
        approvedBy: 'Anita Roy (Ops Head)',
        approvedAt: nowFormatted(),
        opsDecision: 'approved',
        proofRequired,
        opsComment: proofRequired
          ? 'Approved pending on-site implementation proof verification.'
          : 'Approved. Direct progression to closure authorized (No proof needed).',
      },
      proof: proofRequired
        ? {
            qualityStatus: 'pending',
          }
        : undefined,
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Ops Approval',
          actor: 'Anita Roy',
          actorRole: 'Ops Head',
          action: proofRequired
            ? 'Approved — Additional Implementation Proof Required'
            : 'Approved — No Additional Proof Required',
          comment: proofRequired
            ? 'Physical evidence (photo/scan) required from shop floor before sign-off.'
            : 'Low-risk 4M change; bypassed proof stage to proceed directly to closure.',
        },
      ],
    };

    onUpdateCase(updated);
    setShowOpsApprovalModal(false);
  };

  const handleReturnForReworkOps = () => {
    if (!opsReturnComment.trim()) return;

    const updated: Case4M = {
      ...currentCase,
      status: 'Returned for Rework',
      currentOwner: 'Quality Lead',
      approval: {
        approvedBy: 'Anita Roy (Ops Head)',
        approvedAt: nowFormatted(),
        opsDecision: 'returned_for_rework',
        opsComment: opsReturnComment.trim(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Ops Approval',
          actor: 'Anita Roy',
          actorRole: 'Ops Head',
          action: 'Returned request for rework',
          comment: opsReturnComment.trim(),
        },
      ],
    };

    onUpdateCase(updated);
    setShowOpsReturnModal(false);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: Implementation Proof Handlers
  // --------------------------------------------------------------------------
  const handleSubmitProof = () => {
    if (!proofAttachment) return;

    const updated: Case4M = {
      ...currentCase,
      status: 'Proof Review Pending',
      currentOwner: 'Quality Lead',
      proof: {
        ...currentCase.proof,
        submittedBy: `${currentCase.reporterName} (Supervisor)`,
        submittedAt: nowFormatted(),
        attachment: proofAttachment,
        supervisorNotes: proofNotes.trim(),
        qualityStatus: 'pending',
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Implementation Proof',
          actor: `${currentCase.reporterName} (Supervisor)`,
          actorRole: 'Supervisor',
          action: 'Implementation proof submitted',
          comment: proofNotes.trim() || 'Attached visual verification proof.',
          attachmentName: proofAttachment.name,
        },
      ],
    };

    onUpdateCase(updated);
  };

  const handleAcceptProofQuality = () => {
    const updated: Case4M = {
      ...currentCase,
      status: 'Proof Approval Pending',
      currentOwner: 'Ops Head',
      proof: {
        ...currentCase.proof,
        qualityStatus: 'accepted',
        qualityComment: proofReviewComment.trim() || 'Implementation proof verified on site.',
        qualityReviewedAt: nowFormatted(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Implementation Proof Review',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Implementation proof accepted by Quality',
          comment:
            proofReviewComment.trim() || 'Evidence verified. Sent to Ops Head for proof sign-off.',
        },
      ],
    };

    onUpdateCase(updated);
  };

  const handleReturnProofQuality = () => {
    if (!proofReviewComment.trim()) return;

    const updated: Case4M = {
      ...currentCase,
      status: 'Proof Returned for Rework',
      currentOwner: 'Supervisor',
      proof: {
        ...currentCase.proof,
        qualityStatus: 'returned',
        qualityComment: proofReviewComment.trim(),
        qualityReviewedAt: nowFormatted(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Implementation Proof Review',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Proof returned for rework',
          comment: proofReviewComment.trim(),
        },
      ],
    };

    onUpdateCase(updated);
    setShowProofReturnModal(false);
  };

  const handleApproveProofOps = () => {
    const updated: Case4M = {
      ...currentCase,
      status: 'Ready for Closure',
      currentOwner: 'Quality Lead',
      proof: {
        ...currentCase.proof,
        opsStatus: 'approved',
        opsComment: 'Proof of implementation approved.',
        opsReviewedAt: nowFormatted(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'Proof Ops Approval',
          actor: 'Anita Roy',
          actorRole: 'Ops Head',
          action: 'Implementation proof approved by Ops Head',
          comment: 'Physical verification accepted. Case advanced to S5 closure.',
        },
      ],
    };

    onUpdateCase(updated);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: S5 Closure Handler
  // --------------------------------------------------------------------------
  const handleCloseCase = () => {
    setClosureValidationMsg(null);

    // Validate closure conditions:
    if (!actionsCompleted) {
      setClosureValidationMsg(
        'Required implementation actions must be confirmed as completed before closing this case.'
      );
      return;
    }

    if (!closureComment.trim()) {
      setClosureValidationMsg('Please provide a final closure sign-off comment.');
      return;
    }

    const updated: Case4M = {
      ...currentCase,
      status: 'Closed',
      currentOwner: 'Quality Lead',
      closure: {
        closedBy: 'Vikram Mehta (Quality Lead)',
        closedAt: nowFormatted(),
        requiredActionsCompleted: actionsCompleted,
        controlPlanUpdate,
        pfmeaUpdate,
        closureComment: closureComment.trim(),
      },
      history: [
        ...currentCase.history,
        {
          id: `hist-${Date.now()}`,
          timestamp: nowFormatted(),
          stage: 'S5 Verification & Closure',
          actor: 'Vikram Mehta',
          actorRole: 'Quality Lead',
          action: 'Case verified and closed',
          comment: closureComment.trim(),
        },
      ],
    };

    onUpdateCase(updated);
  };

  const isAssignedToMe = currentCase.currentOwner === currentRole;

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cases Register
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {currentCase.id}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-800">
                {currentCase.machineLine}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-600">{currentCase.partNumber}</span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>Category: <strong>{currentCase.category}</strong></span>
              <span>·</span>
              <span>Reason: <strong>{currentCase.reason}</strong></span>
              <span>·</span>
              <span>Raised by: {currentCase.reporterName}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{currentCase.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Status</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded inline-block">
                {currentCase.status}
              </span>
            </div>
            <div className="text-right border-l border-slate-200 pl-3">
              <span className="text-[11px] text-slate-400 block">Current Owner</span>
              <span className="text-xs font-semibold text-slate-900">
                {currentCase.currentOwner}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Helper if user is not current owner */}
      {!isAssignedToMe && currentCase.status !== 'Closed' && (
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-950">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              This case is waiting on action from <strong>{currentCase.currentOwner}</strong>. You are currently viewing as <strong>{currentRole}</strong>.
            </span>
          </div>
          <button
            onClick={() => onSwitchRole(currentCase.currentOwner)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Switch to {currentCase.currentOwner}
          </button>
        </div>
      )}

      {/* Workflow Progress Stepper */}
      <WorkflowStepper currentCase={currentCase} />

      {/* Case Details & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Dynamic Workflow Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: Original 4M Request Info */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">1. Original 4M Request</h3>
              </div>
              <span className="text-[11px] text-slate-500 capitalize">
                Entry: {currentCase.entryMethod === 'physical' ? 'Physical Form Scan' : 'Digital Form'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Description of Change:</label>
              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                {currentCase.description}
              </p>
            </div>

            {/* If Remarks */}
            {currentCase.remarks && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Remarks:</label>
                <p className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded border border-slate-200">
                  {currentCase.remarks}
                </p>
              </div>
            )}

            {/* Physical Form Attachment View & Extraction (If physical) */}
            {currentCase.physicalAttachment && (
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Attached Shop-Floor 4M Form:
                  </span>
                  <button
                    onClick={() => setPreviewAttachmentUrl(currentCase.physicalAttachment!.dataUrl)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Enlarge Scan Slip
                  </button>
                </div>

                {/* Thumbnail Preview */}
                <div
                  onClick={() => setPreviewAttachmentUrl(currentCase.physicalAttachment!.dataUrl)}
                  className="w-full max-h-48 rounded border border-slate-200 overflow-hidden bg-slate-50 relative cursor-pointer group"
                >
                  <img
                    src={currentCase.physicalAttachment.dataUrl}
                    alt={currentCase.physicalAttachment.name}
                    className="w-full h-48 object-cover object-top group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium gap-1.5">
                    <Eye className="w-4 h-4" />
                    Click to inspect full physical document
                  </div>
                </div>

                {/* Note about no fake OCR */}
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                  <strong>Notice:</strong> Structured parameters from this physical scan are confirmed manually by the Quality Lead below without automatic OCR assumptions.
                </p>
              </div>
            )}

            {/* Supporting Attachment View (If digital) */}
            {currentCase.supportingAttachment && (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-800">Supporting Attachment:</span>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-800">
                      {currentCase.supportingAttachment.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewAttachmentUrl(currentCase.supportingAttachment!.dataUrl)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC STAGE PANELS BASED ON CURRENT STATUS */}

          {/* 1. QUALITY REVIEW PANEL (When pending quality review) */}
          {(currentCase.status === 'Pending Quality Review' ||
            currentCase.status === 'Returned for Rework') && (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    2. Quality Lead Review &amp; Assessment
                  </h3>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Quality Lead' ? 'Your Action Required' : 'Assigned to Quality Lead'}
                </span>
              </div>

              {/* If Scanned form, allow confirming structured details */}
              {currentCase.entryMethod === 'physical' && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Confirm Structured Details from Form:
                    </span>
                    <span className="text-[10px] text-slate-400">Manual verification</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Machine / Line
                      </label>
                      <input
                        type="text"
                        value={confirmedMachine}
                        onChange={(e) => setConfirmedMachine(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Part Number
                      </label>
                      <input
                        type="text"
                        value={confirmedPart}
                        onChange={(e) => setConfirmedPart(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        4M Category
                      </label>
                      <select
                        value={confirmedCategory}
                        onChange={(e) => setConfirmedCategory(e.target.value as ChangeCategory)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="Man">Man</option>
                        <option value="Machine">Machine</option>
                        <option value="Material">Material</option>
                        <option value="Method">Method</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Change Reason
                      </label>
                      <select
                        value={confirmedReason}
                        onChange={(e) => setConfirmedReason(e.target.value as ChangeReason)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="Tool / insert">Tool / insert</option>
                        <option value="Breakdown">Breakdown</option>
                        <option value="Operator / shift">Operator / shift</option>
                        <option value="Method change">Method change</option>
                        <option value="Die or fixture">Die or fixture</option>
                        <option value="Setting / parameter">Setting / parameter</option>
                        <option value="Material or lot">Material or lot</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* S2: Containment Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Containment / Initial Response Choice <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Hold the line',
                      'Run 100% inspection',
                      'Run normal after first-off acceptance',
                    ] as ContainmentChoice[]
                  ).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      disabled={currentRole !== 'Quality Lead'}
                      onClick={() => setContainmentChoice(choice)}
                      className={`p-3 text-left border rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        containmentChoice === choice
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={containmentChoice === choice}
                          onChange={() => {}}
                          className="text-blue-600"
                        />
                        <span className="font-semibold">{choice}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mt-2 mb-1">
                    Containment Specifics / Remarks:
                  </label>
                  <input
                    type="text"
                    value={containmentComment}
                    onChange={(e) => setContainmentComment(e.target.value)}
                    disabled={currentRole !== 'Quality Lead'}
                    placeholder="e.g. Red quarantine bin for suspect batch 4B; first 5 parts dimension report required."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* S3: Quality Assessment Fields */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Quality Assessment</span>
                  <span className="text-[11px] text-slate-400">Proposed — pending confirmation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Impact Assessment
                    </label>
                    <select
                      value={impactAssessment}
                      onChange={(e) => setImpactAssessment(e.target.value as ImpactAssessment)}
                      disabled={currentRole !== 'Quality Lead'}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="Minor">Minor</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Major">Major</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Suspect Quantity (Pcs)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={suspectQuantity}
                      onChange={(e) =>
                        setSuspectQuantity(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      disabled={currentRole !== 'Quality Lead'}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white tabular-nums font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      PPAP Resubmission Required?
                    </label>
                    <select
                      value={ppapRequired}
                      onChange={(e) => setPpapRequired(e.target.value as TriStateDecision)}
                      disabled={currentRole !== 'Quality Lead'}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                      <option value="To be determined">To be determined</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Required Implementation Actions (if any)
                  </label>
                  <input
                    type="text"
                    value={requiredActions}
                    onChange={(e) => setRequiredActions(e.target.value)}
                    disabled={currentRole !== 'Quality Lead'}
                    placeholder="e.g. Inspect first 5 parts on CMM; verify torque and tool calibration certificate."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white disabled:bg-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Action Owner
                    </label>
                    <input
                      type="text"
                      value={actionOwner}
                      onChange={(e) => setActionOwner(e.target.value)}
                      disabled={currentRole !== 'Quality Lead'}
                      placeholder="e.g. Rajesh Kumar (Supervisor)"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={actionDueDate}
                      onChange={(e) => setActionDueDate(e.target.value)}
                      disabled={currentRole !== 'Quality Lead'}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quality Lead Actions */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveQualityDraft}
                    disabled={currentRole !== 'Quality Lead'}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQualityReturnModal(true)}
                    disabled={currentRole !== 'Quality Lead'}
                    className="px-3.5 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    Return for Correction
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSendForApproval}
                  disabled={currentRole !== 'Quality Lead'}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Send for Approval (Ops Head)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. RETURNED FOR CORRECTION PANEL (For Supervisor) */}
          {currentCase.status === 'Returned for Correction' && (
            <div className="bg-white border-2 border-amber-400 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Request Returned for Correction
                  </h3>
                </div>
                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Supervisor' ? 'Supervisor Action Needed' : 'Assigned to Supervisor'}
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs space-y-1">
                <span className="font-semibold text-amber-900">Quality Lead Comments:</span>
                <p className="text-amber-950 leading-relaxed">
                  {currentCase.review.qualityComment || 'Please clarify details and resubmit.'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Updated Description / Corrected Details:
                  </label>
                  <textarea
                    rows={3}
                    value={correctedDescription}
                    onChange={(e) => setCorrectedDescription(e.target.value)}
                    disabled={currentRole !== 'Supervisor'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Supervisor Note for Quality Lead:
                  </label>
                  <input
                    type="text"
                    value={correctionSupervisorNote}
                    onChange={(e) => setCorrectionSupervisorNote(e.target.value)}
                    disabled={currentRole !== 'Supervisor'}
                    placeholder="e.g. Tooling offset recalibrated to 0.02mm, serial range verified."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleResubmitCorrection}
                  disabled={currentRole !== 'Supervisor'}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Resubmit to Quality Lead
                </button>
              </div>
            </div>
          )}

          {/* 3. OPS HEAD APPROVAL PANEL */}
          {currentCase.status === 'Pending Ops Approval' && (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">3. Ops Head Approval</h3>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Ops Head' ? 'Your Decision Required' : 'Assigned to Ops Head'}
                </span>
              </div>

              {/* Assessment Summary for Ops Head */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
                <h4 className="font-semibold text-slate-900">Quality Assessment Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-500">Containment:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {currentCase.review.containmentChoice || 'Hold the line'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Impact Assessment:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {currentCase.review.impactAssessment || 'Moderate'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Suspect Quantity:</span>
                    <p className="font-semibold text-slate-800 mt-0.5 font-mono tabular-nums">
                      {currentCase.review.suspectQuantity ?? 0} pcs
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">PPAP Required:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {currentCase.review.ppapRequired || 'No'}
                    </p>
                  </div>
                </div>

                {currentCase.review.requiredActions && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Required Implementation Actions:</span>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {currentCase.review.requiredActions}
                    </p>
                  </div>
                )}
              </div>

              {/* Ops Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowOpsReturnModal(true)}
                  disabled={currentRole !== 'Ops Head'}
                  className="px-3.5 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md disabled:opacity-50 cursor-pointer"
                >
                  Return for Rework
                </button>

                <button
                  type="button"
                  onClick={() => setShowOpsApprovalModal(true)}
                  disabled={currentRole !== 'Ops Head'}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Approve 4M Change
                </button>
              </div>
            </div>
          )}

          {/* 4. CONDITIONAL IMPLEMENTATION PROOF PANEL (Supervisor Submission) */}
          {currentCase.status === 'Awaiting Implementation Proof' && (
            <div className="bg-white border-2 border-purple-400 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Implementation Proof Required
                  </h3>
                </div>
                <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Supervisor' ? 'Supervisor Action Needed' : 'Assigned to Supervisor'}
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-md text-xs text-purple-950 space-y-1">
                <p className="font-semibold">Ops Head Instructions:</p>
                <p className="leading-relaxed">
                  {currentCase.approval?.opsComment ||
                    'Additional proof required from shop floor before sign-off.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <AttachmentUploader
                  attachment={proofAttachment}
                  onAttachmentChange={setProofAttachment}
                  label="Implementation Proof (Photo / Scan / PDF)"
                  helperText="Live camera capture or document upload"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Supervisor Verification Notes:
                </label>
                <textarea
                  rows={2}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  disabled={currentRole !== 'Supervisor'}
                  placeholder="e.g. First-off 5 parts inspected on CMM. All dimensions within tolerance envelope. Tool offset verified."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={currentRole !== 'Supervisor' || !proofAttachment}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Submit Implementation Proof
                </button>
              </div>
            </div>
          )}

          {/* 5. QUALITY PROOF REVIEW PANEL */}
          {currentCase.status === 'Proof Review Pending' && (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Quality Lead — Review Implementation Proof
                  </h3>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Quality Lead' ? 'Your Action Required' : 'Assigned to Quality Lead'}
                </span>
              </div>

              {/* Proof Attachment Display */}
              {currentCase.proof?.attachment && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">Submitted Proof:</span>
                    <button
                      onClick={() =>
                        setPreviewAttachmentUrl(currentCase.proof!.attachment!.dataUrl)
                      }
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Full Proof
                    </button>
                  </div>
                  <div
                    onClick={() => setPreviewAttachmentUrl(currentCase.proof!.attachment!.dataUrl)}
                    className="w-full h-44 rounded border border-slate-200 overflow-hidden bg-white cursor-pointer group relative"
                  >
                    <img
                      src={currentCase.proof.attachment.dataUrl}
                      alt="Proof"
                      className="w-full h-full object-contain group-hover:opacity-90"
                    />
                  </div>
                  {currentCase.proof.supervisorNotes && (
                    <p className="text-xs text-slate-600 italic">
                      Supervisor Note: "{currentCase.proof.supervisorNotes}"
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Quality Lead Proof Assessment Comment:
                </label>
                <input
                  type="text"
                  value={proofReviewComment}
                  onChange={(e) => setProofReviewComment(e.target.value)}
                  disabled={currentRole !== 'Quality Lead'}
                  placeholder="e.g. CMM inspection report verified. All dimensions within tolerance."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowProofReturnModal(true)}
                  disabled={currentRole !== 'Quality Lead'}
                  className="px-3.5 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md disabled:opacity-50 cursor-pointer"
                >
                  Return Proof for Rework
                </button>

                <button
                  type="button"
                  onClick={handleAcceptProofQuality}
                  disabled={currentRole !== 'Quality Lead'}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Accept Proof &amp; Send to Ops Head
                </button>
              </div>
            </div>
          )}

          {/* 6. PROOF RETURNED FOR REWORK (Supervisor) */}
          {currentCase.status === 'Proof Returned for Rework' && (
            <div className="bg-white border-2 border-amber-400 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Proof Returned for Rework</h3>
                </div>
                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                  Supervisor Action Needed
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs space-y-1">
                <span className="font-semibold text-amber-900">Quality Lead Comments:</span>
                <p className="text-amber-950 leading-relaxed">
                  {currentCase.proof?.qualityComment || 'Please provide updated proof.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <AttachmentUploader
                  attachment={proofAttachment}
                  onAttachmentChange={setProofAttachment}
                  label="Attach Updated Implementation Proof"
                  helperText="Replace photo or scan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Updated Supervisor Notes:
                </label>
                <textarea
                  rows={2}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  disabled={currentRole !== 'Supervisor'}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={currentRole !== 'Supervisor' || !proofAttachment}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Resubmit Updated Proof
                </button>
              </div>
            </div>
          )}

          {/* 7. OPS PROOF APPROVAL PANEL */}
          {currentCase.status === 'Proof Approval Pending' && (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Ops Head — Approve Implementation Proof
                  </h3>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {currentRole === 'Ops Head' ? 'Your Sign-Off Required' : 'Assigned to Ops Head'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    Verified Implementation Proof (Accepted by Quality Lead)
                  </span>
                  <button
                    onClick={() =>
                      setPreviewAttachmentUrl(currentCase.proof!.attachment!.dataUrl)
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    View Document
                  </button>
                </div>

                {currentCase.proof?.attachment && (
                  <div className="h-32 rounded border border-slate-200 overflow-hidden bg-white">
                    <img
                      src={currentCase.proof.attachment.dataUrl}
                      alt="Proof"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="text-slate-600 text-xs">
                  <p>Quality Comment: <em>"{currentCase.proof?.qualityComment}"</em></p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleApproveProofOps}
                  disabled={currentRole !== 'Ops Head'}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Approve Implementation Proof &amp; Proceed to Closure
                </button>
              </div>
            </div>
          )}

          {/* 8. S5 VERIFY AND CLOSE PANEL */}
          {currentCase.status === 'Ready for Closure' && (
            <div className="bg-white border-2 border-emerald-500 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">S5. Verify &amp; Close Case</h3>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                  Closure Checklist
                </span>
              </div>

              {closureValidationMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                  {closureValidationMsg}
                </div>
              )}

              <div className="space-y-3 text-xs">
                {/* Condition 1: Required actions completed */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={actionsCompleted}
                      onChange={(e) => setActionsCompleted(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900">
                        Required implementation actions completed?
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {currentCase.review.requiredActions ||
                          'First-off verification and tool recalibration confirmed on line.'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Condition 2: Proof Status */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">
                      Implementation Proof Verification:
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {currentCase.approval?.proofRequired
                        ? 'Proof was requested, reviewed by Quality, and approved by Ops Head.'
                        : 'No additional implementation proof required (bypassed per Ops Head approval).'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    {currentCase.approval?.proofRequired ? 'Proof Approved' : 'Not Required'}
                  </span>
                </div>

                {/* Condition 3: Control Plan & PFMEA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Control Plan Update Required?
                    </label>
                    <select
                      value={controlPlanUpdate}
                      onChange={(e) => setControlPlanUpdate(e.target.value as TriStateDecision)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="To be determined">To be determined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      PFMEA Update Required?
                    </label>
                    <select
                      value={pfmeaUpdate}
                      onChange={(e) => setPfmeaUpdate(e.target.value as TriStateDecision)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                      <option value="To be determined">To be determined</option>
                    </select>
                  </div>
                </div>

                {/* Condition 4: Closure Comment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Final Closure Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={closureComment}
                    onChange={(e) => setClosureComment(e.target.value)}
                    placeholder="e.g. All checks passed. Tooling documentation and shop-floor work instruction updated. Closed."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Proposed — pending confirmation
                </span>
                <button
                  type="button"
                  onClick={handleCloseCase}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Close Case
                </button>
              </div>
            </div>
          )}

          {/* 9. CLOSED CASE SUMMARY PANEL */}
          {currentCase.status === 'Closed' && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 pb-2 border-b border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Case Resolved and Closed</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-slate-500">Closed By:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {currentCase.closure?.closedBy || 'Quality Lead'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Closure Date:</span>
                  <p className="font-mono text-slate-800 mt-0.5 tabular-nums">
                    {currentCase.closure?.closedAt}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Control Plan Update:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {currentCase.closure?.controlPlanUpdate}
                  </p>
                </div>
              </div>
              {currentCase.closure?.closureComment && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Closure Sign-Off Note:</span>
                  <p className="text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200 mt-0.5">
                    {currentCase.closure.closureComment}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Complete Chronological Workflow History */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900">Workflow History</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentCase.history.length} events
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {currentCase.history
                .slice()
                .reverse()
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative pl-5 pb-3 border-l-2 border-slate-200 last:border-l-transparent text-xs"
                  >
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-400" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{item.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.actor} <span className="text-slate-400">({item.actorRole})</span>
                      </p>
                      {item.comment && (
                        <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
                          {item.comment}
                        </p>
                      )}
                      {item.attachmentName && (
                        <div className="text-[10px] text-blue-600 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{item.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Case Summary card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">4M Reference Rules:</p>
            <p className="text-[11px] leading-relaxed">
              4M Changes (Man, Machine, Material, Method) require documented containment before batch release.
            </p>
            <p className="text-[10px] text-slate-400 pt-1">
              Abscode Quality · Prototype — demo data
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 1: Quality Return for Correction Modal */}
      {/* -------------------------------------------------------------------------- */}
      {showQualityReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Return Request for Correction</h4>
            <p className="text-xs text-slate-600">
              Provide specific instructions for the Supervisor explaining what information or
              clarifications are needed.
            </p>
            <textarea
              rows={3}
              value={qualityReturnComment}
              onChange={(e) => setQualityReturnComment(e.target.value)}
              placeholder="e.g. Specify suspect quantity and verify if tool offset was adjusted."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowQualityReturnModal(false)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnToSupervisor}
                disabled={!qualityReturnComment.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 2: Ops Head Approval & Implementation Proof Choice Modal */}
      {/* -------------------------------------------------------------------------- */}
      {showOpsApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Ops Head Decision
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Is additional implementation proof required?
              </h4>
              <p className="text-xs text-slate-500">
                Choose the routing path for this 4M change. This decision controls whether the case
                requires physical evidence submission or proceeds directly to closure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option A: Yes — Proof Required */}
              <button
                type="button"
                onClick={() => handleOpsDecision(true)}
                className="p-4 border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 rounded-lg text-left transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                    Yes — Proof Required
                  </span>
                  <Camera className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Routes case to Supervisor for camera/photo evidence, then Quality review &amp; Ops sign-off.
                </p>
              </button>

              {/* Option B: No — No Additional Proof */}
              <button
                type="button"
                onClick={() => handleOpsDecision(false)}
                className="p-4 border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 rounded-lg text-left transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    No — No Additional Proof
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bypasses evidence upload. Proceeds directly to S5 verification and closure checks.
                </p>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Proposed demo behaviour — routing adapts
              </span>
              <button
                type="button"
                onClick={() => setShowOpsApprovalModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 3: Ops Head Return for Rework Modal */}
      {/* -------------------------------------------------------------------------- */}
      {showOpsReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Return Request for Rework</h4>
            <p className="text-xs text-slate-600">
              Provide comments explaining what needs rework before Ops approval.
            </p>
            <textarea
              rows={3}
              value={opsReturnComment}
              onChange={(e) => setOpsReturnComment(e.target.value)}
              placeholder="e.g. Re-verify impact assessment on batch H-882 before approval."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOpsReturnModal(false)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnForReworkOps}
                disabled={!opsReturnComment.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 4: Quality Return Proof for Rework Modal */}
      {/* -------------------------------------------------------------------------- */}
      {showProofReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Return Proof for Rework</h4>
            <p className="text-xs text-slate-600">
              Specify why the implementation proof was insufficient and what updated evidence is required.
            </p>
            <textarea
              rows={3}
              value={proofReviewComment}
              onChange={(e) => setProofReviewComment(e.target.value)}
              placeholder="e.g. Measurement gauge photo is blurry. Please provide legible calibration reading."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProofReturnModal(false)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnProofQuality}
                disabled={!proofReviewComment.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* Lightbox / Attachment Image Previewer */}
      {/* -------------------------------------------------------------------------- */}
      {previewAttachmentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-900">Document Inspection</span>
              <button
                onClick={() => setPreviewAttachmentUrl(null)}
                className="text-slate-500 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100 max-h-[75vh]">
              <img
                src={previewAttachmentUrl}
                alt="Enlarged document"
                className="max-w-full max-h-full object-contain rounded bg-white shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
