import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { useAsyncFn, useAsyncRetry } from 'react-use';
import { enqueueSnackbar } from 'notistack';

import {
  _createExtensionPdf,
  _deleteExtensionFile,
  _downloadExtensionPdf,
  _extensionConfirm,
  _getExtensionInfo,
  _viewExtensionPdf,
} from '@/request';
import { IExtensionInfo, IGetExtensionPdfParam } from '@/types/loan/extension';
import { useRenderPdf } from '@/hooks';
import { createFile } from '@/utils';

interface IUseLoanExtensionRequestFetchProps {
  resetFilter: (res: AxiosResponse<IExtensionInfo, any>) => void;
  setInitLoading: Dispatch<SetStateAction<boolean>>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  open: () => void;
}

export const useLoanExtensionRequestFetch = ({
  resetFilter,
  setInitLoading,
  formRef,
  open,
}: IUseLoanExtensionRequestFetchProps) => {
  const router = useRouter();
  const { loanId } = router.query;

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [generateAgreementLoading, setGenerateAgreementLoading] =
    useState(false);

  const { value, retry } = useAsyncRetry(async () => {
    return typeof loanId === 'string'
      ? await _getExtensionInfo(parseInt(loanId as string))
          .then((res) => {
            resetFilter(res);
            return res;
          })
          .catch(({ message, variant, header }) => {
            enqueueSnackbar(message, { variant, isSimple: !header, header });
          })
          .finally(() => {
            setInitLoading(false);
          })
      : null;
  }, [loanId]);

  const [, createExtensionPdf] = useAsyncFn(
    async (param: IGetExtensionPdfParam) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      setGenerateAgreementLoading(true);
      await _createExtensionPdf(param)
        .then(async (res) => {
          enqueueSnackbar('Generated successfully.', {
            variant: 'success',
          });
          return res;
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        })
        .finally(() => {
          setTimeout(() => {
            setGenerateAgreementLoading(false);
          }, 1000);
        });
    },
    [formRef.current],
  );

  const [confirmState, extensionConfirm] = useAsyncFn(
    async (id: number) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      await _extensionConfirm({
        loanId: parseInt(loanId as string),
        id,
      })
        .then(async (res) => {
          enqueueSnackbar('Loan extension applied successfully.', {
            variant: 'success',
          });
          return res;
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [formRef.current, loanId],
  );

  const [viewState, viewExtensionPdf] = useAsyncFn(
    async (downloadId: number) => {
      open();
      return await _viewExtensionPdf(downloadId)
        .then((res) => {
          setTimeout(() => {
            renderFile(res.data);
          }, 500);
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [],
  );

  const [downloadState, downloadExtensionPdf] = useAsyncFn(
    async (downloadId: number) => {
      await _downloadExtensionPdf(downloadId)
        .then((res) => {
          const fileName = res.headers['content-disposition']
            .split(';')[1]
            .split('filename=')[1];
          const blob = new Blob([res.data], {
            type: 'application/octet-stream',
          });
          createFile(blob, fileName);
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [],
  );

  const [deleteExtensionFileState, deleteExtensionFile] = useAsyncFn(
    async (downloadId: number) => {
      await _deleteExtensionFile(downloadId)
        .then(async () => {
          enqueueSnackbar('Undone Successful', {
            variant: 'success',
          });
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [],
  );

  return {
    value,
    retry,
    createExtensionPdf,
    generateAgreementLoading,
    confirmState,
    extensionConfirm,
    pdfFile,
    viewState,
    viewExtensionPdf,
    downloadState,
    downloadExtensionPdf,
    deleteExtensionFileState,
    deleteExtensionFile,
  };
};
