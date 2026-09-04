import { SITE_CONTENT } from './site-content';

describe('SITE_CONTENT', () => {
  it('keeps the approved navigation and homepage content invariants', () => {
    expect(SITE_CONTENT.navigation.map((item) => item.label)).toEqual([
      '關於本會',
      '最新消息',
      '學術活動',
      '期刊資源',
      '會員專區',
    ]);
    expect(SITE_CONTENT.news).toHaveLength(3);
    expect(SITE_CONTENT.hero.primaryAction.label).toBe('查看學術活動');
    expect(SITE_CONTENT.hero.secondaryAction.label).toBe('會員登入');
    expect(
      SITE_CONTENT.resources.find((item) => item.title === '微免與感染雜誌')?.href,
    ).toBe('https://jmii.org/');
  });
});
