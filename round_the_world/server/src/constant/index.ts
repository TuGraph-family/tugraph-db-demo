import { getPxToRem } from '@/utils';

export const PROXY_HOST = `http://127.0.0.1:9091`;
export const PROXY_HTTP = 'http://127.0.0.1:7071';
export const PUBLISH_HTTP = 'http://127.0.0.1:7071';
export const CURRENT_HTTP = 'http://127.0.0.1:7071';
  // process.env.NODE_ENV === 'production' ? PUBLISH_HTTP : PROXY_HTTP;
export const TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9sb2dpbl90aW1lIjoiMTY5MDQ0NjA0Ni40ODg1OTUiLCJpc3MiOiJmbWEuYWkiLCJyZWZyZXNoX3RpbWUiOiIxNjkwNDQ2MDQ2LjQ4ODU4NyJ9.DWE-rTnNyC80HB0omoZ3uL3YvMBNAgWZDSMEmy-hGaw';
export const HTTP_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9sb2dpbl90aW1lIjoiMTY5MTk5ODU3Mi44NjE4ODgiLCJpc3MiOiJmbWEuYWkiLCJyZWZyZXNoX3RpbWUiOiIxNjkxOTk4NTcyLjg2MTg3NiJ9.3PHvQzB2UccN0WX5PWF3cuqcrgtfMV8AUG7Z0_cqmjY';

export const MAX_OFFSET = {
  flight: getPxToRem(158),
  dot: getPxToRem(228),
  line: getPxToRem(300),
};

export const LEFT_OFFSET = [
  getPxToRem(10),
  getPxToRem(62),
  getPxToRem(114),
  getPxToRem(166),
];
export const HEIGHTS = [
  [getPxToRem(48)],
  [getPxToRem(25), getPxToRem(65)],
  [getPxToRem(20), getPxToRem(47), getPxToRem(73)],
  [getPxToRem(16), getPxToRem(36), getPxToRem(53), getPxToRem(76)],
];

export const STAY_TYPE = [
  {
    text: '国际速递',
    code: 3,
  },
  {
    text: '商务旅行',
    code: 6,
  },
  {
    text: '出差办公',
    code: 10,
  },
];

export const IMG = [
  {
    id: 'coordinateIcon',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*u0-YSal20OIAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'plane',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*QOZaS74dxyYAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'coordinateIcon1',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*9rNySpsobikAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point0',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*O05hQLy4G2gAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point1',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*NKmWRo8Ys1kAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point2',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*WuzNSrrP5Z8AAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point3',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*gnjPR7ej1kMAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point4',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*8bDIR6g5tj4AAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point5',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*H3qCQY9JvCcAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point6',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*PV_oSoOOGaoAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point7',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*TGkbRI0g0Y4AAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point8',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*2xJhQqt4IFgAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point9',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*JPMlTLNl_3AAAAAAAAAAAAAADgOBAQ/originall',
  },
  {
    id: 'point10',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*eA5UTbKTDVQAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point11',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*WimZSaS8FlEAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point12',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*5JCYSa4wpvgAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point13',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*PSuZSo5Y6xkAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point14',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*u5xCT7SpdxgAAAAAAAAAAAAADgOBAQ/original',
  },

  {
    id: 'point15',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*PI49R5e-7B0AAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point16',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Cy0gR7VtbR4AAAAAAAAAAAAADgOBAQ/original',
  },

  {
    id: 'point17',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*9dMNRYLGg3EAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    id: 'point18',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*GB4xRrTR9AQAAAAAAAAAAAAADgOBAQ/original',
  },

  {
    id: 'point19',
    image:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*A1WmS7onVhAAAAAAAAAAAAAADgOBAQ/original',
  },
];
