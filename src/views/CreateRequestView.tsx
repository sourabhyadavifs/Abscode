import React, { useState } from 'react';
import {
  Attachment,
  Case4M,
  ChangeCategory,
  ChangeReason,
  ChangeType,
  Role,
} from '../types';
import { AttachmentUploader } from '../components/AttachmentUploader';
import {
  Camera,
  FileEdit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface CreateRequestViewProps {
  currentRole: Role;
  onCaseCreated: (newCase: Case4M) => void;
  onCancel: () => void;
  onViewCase: (caseId: string) => void;
}

export const CreateRequestView: React.FC<CreateRequestViewProps> = ({
  currentRole,
  onCaseCreated,
  onCancel,
  onViewCase,
}) => {
  // Entry mode selection: null (selection screen), 'physical', 'digital'
  const [entryMode, setEntryMode] = useState<'physical' | 'digital' | null>(null);

  // Success state after creation
  const [createdCase, setCreatedCase] = useState<Case4M | null>(null);

  // Digital mode review preview step
  const [isDigitalReviewStep, setIsDigitalReviewStep] = useState<boolean>(false);

  // Form Fields - Physical
  const [reporterName, setReporterName] = useState('Rajesh Kumar');
  const [reporterEmployeeId, setReporterEmployeeId] = useState('EMP-4081');
  const [physicalRemarks, setPhysicalRemarks] = useState('');
  const [physicalAttachment, setPhysicalAttachment] = useState<Attachment | undefined>();
  const [physicalFormError, setPhysicalFormError] = useState<string | null>(null);

  // Form Fields - Digital
  const [machineLine, setMachineLine] = useState('Press-04 (Line B)');
  const [partNumber, setPartNumber] = useState('BRK-204');
  const [dateTime, setDateTime] = useState(
    () => new Date().toISOString().replace('T', ' ').slice(0, 16)
  );
  const [category, setCategory] = useState<ChangeCategory>('Machine');
  const [reason, setReason] = useState<ChangeReason>('Tool / insert');
  const [changeType, setChangeType] = useState<ChangeType>('Unplanned');
  const [description, setDescription] = useState(
    'Chipped punch insert detected during regular production. Emergency tooling change required.'
  );
  const [supportingAttachment, setSupportingAttachment] = useState<Attachment | undefined>();
  const [digitalFormError, setDigitalFormError] = useState<string | null>(null);

  const categories: ChangeCategory[] = ['Man', 'Machine', 'Material', 'Method'];

  const reasons: ChangeReason[] = [
    'Tool / insert',
    'Breakdown',
    'Operator / shift',
    'Method change',
    'Die or fixture',
    'Setting / parameter',
    'Material or lot',
    'Other',
  ];

  // Helper to generate next Case ID
  const generateCaseId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `MC-00${randomNum}`;
  };

  // Submit Physical Form
  const handleSubmitPhysical = (e: React.FormEvent) => {
    e.preventDefault();
    setPhysicalFormError(null);

    if (!reporterName.trim()) {
      setPhysicalFormError('Please enter reporter name.');
      return;
    }
    if (!physicalAttachment) {
      setPhysicalFormError(
        'Please capture a photo or upload a scan/document of the physical 4M form.'
      );
      return;
    }

    const newCaseId = generateCaseId();
    const newCase: Case4M = {
      id: newCaseId,
      entryMethod: 'physical',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending Quality Review',
      currentOwner: 'Quality Lead',
      reporterName: reporterName.trim(),
      reporterEmployeeId: reporterEmployeeId.trim() || 'EMP-TEMP',
      // In physical form, these are extracted or confirmed by Quality Lead
      machineLine: 'Pending Quality extraction',
      partNumber: 'Pending Quality extraction',
      category: 'Machine',
      reason: 'Other',
      changeType: 'Unplanned',
      description: physicalRemarks || 'Physical form submitted via shop floor camera scan.',
      remarks: physicalRemarks,
      physicalAttachment,
      review: {},
      approval: {},
      history: [
        {
          id: `hist-${Date.now()}-1`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          stage: 'Request Submission',
          actor: `${reporterName} (${reporterEmployeeId})`,
          actorRole: currentRole,
          action: 'Physical 4M form scanned and submitted',
          comment: physicalRemarks || 'Paper form scanned from shop floor.',
          attachmentName: physicalAttachment.name,
        },
      ],
    };

    onCaseCreated(newCase);
    setCreatedCase(newCase);
  };

  // Move to Digital Review Step
  const handleProceedDigitalReview = (e: React.FormEvent) => {
    e.preventDefault();
    setDigitalFormError(null);

    if (!machineLine.trim()) {
      setDigitalFormError('Please specify Machine / Line.');
      return;
    }
    if (!partNumber.trim()) {
      setDigitalFormError('Please specify Part Number.');
      return;
    }
    if (!description.trim()) {
      setDigitalFormError('Please provide a short description of what happened.');
      return;
    }

    setIsDigitalReviewStep(true);
  };

  // Final Submit Digital
  const handleSubmitDigital = () => {
    const newCaseId = generateCaseId();
    const newCase: Case4M = {
      id: newCaseId,
      entryMethod: 'digital',
      createdAt: dateTime,
      status: 'Pending Quality Review',
      currentOwner: 'Quality Lead',
      reporterName: reporterName.trim(),
      reporterEmployeeId: reporterEmployeeId.trim() || 'EMP-TEMP',
      machineLine: machineLine.trim(),
      partNumber: partNumber.trim(),
      category,
      reason,
      changeType,
      description: description.trim(),
      supportingAttachment,
      review: {},
      approval: {},
      history: [
        {
          id: `hist-${Date.now()}-1`,
          timestamp: dateTime,
          stage: 'Request Submission',
          actor: `${reporterName} (${reporterEmployeeId})`,
          actorRole: currentRole,
          action: 'Digital 4M request created',
          comment: description.trim(),
          attachmentName: supportingAttachment?.name,
        },
      ],
    };

    onCaseCreated(newCase);
    setCreatedCase(newCase);
  };

  // If case was just created, show confirmation
  if (createdCase) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs text-center space-y-5">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">4M Request Submitted</h2>
            <p className="text-sm text-slate-600">
              Generated Case ID:{' '}
              <span className="font-mono font-bold text-slate-900">{createdCase.id}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-blue-700">{createdCase.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Assigned Next Owner:</span>
              <span className="font-semibold text-slate-800">{createdCase.currentOwner}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Submission Method:</span>
              <span className="font-medium text-slate-800 capitalize">
                {createdCase.entryMethod === 'physical'
                  ? 'Physical form scan'
                  : 'Digital direct form'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Raised By:</span>
              <span className="text-slate-800">
                {createdCase.reporterName} ({createdCase.reporterEmployeeId})
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-left bg-blue-50 border border-blue-100 p-3 rounded">
            <strong>Next Workflow Step:</strong> The request is now waiting for the{' '}
            <strong>Quality Lead</strong> to perform initial containment selection and quality
            assessment. You can switch to Quality Lead in the top bar to review this case.
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewCase(createdCase.id)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2"
            >
              Open This Case
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors"
            >
              Back to Cases Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial selection screen: Option A vs Option B
  if (entryMode === null) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="space-y-1">
          <button
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel and return
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create 4M Change Request
          </h1>
          <p className="text-sm text-slate-500">
            Choose your preferred submission method from the shop floor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Physical Form */}
          <div
            onClick={() => setEntryMode('physical')}
            className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-lg p-6 cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Option A: Scan / Upload Physical Form
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capture paper 4M forms directly from the shop floor using camera scan or document upload.
              </p>
            </div>

            <div className="pt-6">
              <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1">
                Start with camera scan
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Option B: Digital Entry */}
          <div
            onClick={() => setEntryMode('digital')}
            className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-lg p-6 cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileEdit className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Option B: Enter Details Digitally
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill out the structured 4M change form with machine, part, category and reason.
              </p>
            </div>

            <div className="pt-6">
              <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1">
                Open digital form
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Both options feed into the same unified 4M review and approval workflow.</span>
          <span className="text-slate-400">Proposed — pending confirmation</span>
        </div>
      </div>
    );
  }

  // Render Option A: Physical Form Submission
  if (entryMode === 'physical') {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div>
          <button
            onClick={() => setEntryMode(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Switch submission method
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Option A: Scan Physical 4M Form
            </h1>
            <span className="text-[11px] text-slate-500">Minimal shop-floor data</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture a clear photo of the physical shop-floor 4M change slip. The Quality Lead will
            confirm structured details during review.
          </p>
        </div>

        {physicalFormError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{physicalFormError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmitPhysical}
          className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5 shadow-2xs"
        >
          {/* Attachment controller with Real Camera & Upload */}
          <div className="p-4 bg-slate-50/75 rounded-lg border border-slate-200">
            <AttachmentUploader
              attachment={physicalAttachment}
              onAttachmentChange={setPhysicalAttachment}
              label="Physical 4M Form Document"
              helperText="Live camera scan or document upload"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Reporter Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Rajesh Kumar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Employee ID <span className="text-slate-400 font-normal">(demo)</span>
              </label>
              <input
                type="text"
                value={reporterEmployeeId}
                onChange={(e) => setReporterEmployeeId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="e.g. EMP-4081"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Optional Remarks / Shop Floor Note
            </label>
            <textarea
              rows={3}
              value={physicalRemarks}
              onChange={(e) => setPhysicalRemarks(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="e.g. Scanned from Line B bulletin board. Line stopped at 08:10 AM."
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setEntryMode(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
            >
              Submit 4M Request
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render Option B: Digital Entry - Review Step
  if (entryMode === 'digital' && isDigitalReviewStep) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div>
          <button
            onClick={() => setIsDigitalReviewStep(false)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Edit details
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Review 4M Request Before Submission
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify the structured details below before sending to Quality Lead.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs text-xs">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500">Machine / Line:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{machineLine}</p>
            </div>
            <div>
              <span className="text-slate-500">Part / Running Part:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{partNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500">4M Category:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{category}</p>
            </div>
            <div>
              <span className="text-slate-500">Change Reason:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{reason}</p>
            </div>
            <div>
              <span className="text-slate-500">Change Type:</span>
              <p className="font-semibold text-slate-900 mt-0.5">{changeType}</p>
            </div>
            <div>
              <span className="text-slate-500">Date &amp; Time:</span>
              <p className="font-mono text-slate-900 mt-0.5 tabular-nums">{dateTime}</p>
            </div>
          </div>

          <div className="pb-3 border-b border-slate-200">
            <span className="text-slate-500">Raised By:</span>
            <p className="font-medium text-slate-900 mt-0.5">
              {reporterName} ({reporterEmployeeId})
            </p>
          </div>

          <div className="pb-3 border-b border-slate-200">
            <span className="text-slate-500">What Happened?:</span>
            <p className="text-slate-800 mt-0.5 leading-relaxed">{description}</p>
          </div>

          {supportingAttachment && (
            <div className="pb-2">
              <span className="text-slate-500">Supporting Attachment:</span>
              <p className="font-medium text-blue-700 mt-0.5">{supportingAttachment.name}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDigitalReviewStep(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Edit Details
            </button>
            <button
              type="button"
              onClick={handleSubmitDigital}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs"
            >
              Submit 4M Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Option B: Digital Form
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div>
        <button
          onClick={() => setEntryMode(null)}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Switch submission method
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Option B: Enter Details Digitally
          </h1>
          <span className="text-[11px] text-slate-500">Structured 4M form</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Provide complete operational information as recorded on the 4M Change Record.
        </p>
      </div>

      {digitalFormError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{digitalFormError}</span>
        </div>
      )}

      <form
        onSubmit={handleProceedDigitalReview}
        className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5 shadow-2xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Machine / Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={machineLine}
              onChange={(e) => setMachineLine(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Press-04 (Line B)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Part / Running Part <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. BRK-204"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Date &amp; Time of Change
            </label>
            <input
              type="text"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Raised By (Name)
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={reporterEmployeeId}
              onChange={(e) => setReporterEmployeeId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              4M Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ChangeCategory)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Change Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ChangeReason)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md bg-white"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Change Type <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 pt-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="changeType"
                  value="Planned"
                  checked={changeType === 'Planned'}
                  onChange={() => setChangeType('Planned')}
                  className="text-blue-600"
                />
                Planned
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="changeType"
                  value="Unplanned"
                  checked={changeType === 'Unplanned'}
                  onChange={() => setChangeType('Unplanned')}
                  className="text-blue-600"
                />
                Unplanned
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            What Happened? — Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="Describe the condition, what triggered the change, and immediate action taken."
          />
        </div>

        {/* Optional supporting attachment */}
        <div className="pt-2 border-t border-slate-100">
          <AttachmentUploader
            attachment={supportingAttachment}
            onAttachmentChange={setSupportingAttachment}
            label="Optional Supporting Attachment"
            helperText="Photo of part, tool or parameter sheet (optional)"
          />
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setEntryMode(null)}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
          >
            Review &amp; Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};
