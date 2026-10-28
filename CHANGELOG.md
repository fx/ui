# Changelog

## [2.0.0](https://github.com/fx/ui/compare/v1.0.0...v2.0.0) (2026-10-28)


### ⚠ BREAKING CHANGES

* **button,select,toggle:** sm button/select/toggle height changes from 32px to 36px. icon-sm button size changes from 32px to 36px.

### Features

* add Badge asChild/icon-only and StatusOverlay component ([#6](https://github.com/fx/ui/issues/6)) ([2a24846](https://github.com/fx/ui/commit/2a24846a1c56b3e1f29c4ea96919fbc455911fad))
* **button,select,toggle:** bump sm size from h-8 to h-9 for input alignment ([#9](https://github.com/fx/ui/issues/9)) ([52a7f48](https://github.com/fx/ui/commit/52a7f48f8117472761431f8ec32c773131495b50))
* **combobox:** add multi-select support with chip components ([#12](https://github.com/fx/ui/issues/12)) ([e8d210e](https://github.com/fx/ui/commit/e8d210ece133b6ecc95b673231af8062d7174401))
* **combobox:** add xs size, dropdown variant, and ComboboxSearch ([#11](https://github.com/fx/ui/issues/11)) ([c783631](https://github.com/fx/ui/commit/c78363185228d4d34398b534fb25034f1bb75bfc))
* **slider:** add accessible scalar and range controls ([#21](https://github.com/fx/ui/issues/21)) ([042f0f1](https://github.com/fx/ui/commit/042f0f16d81d67f343438a007789e67dff878e27))
* **styles:** register @tailwindcss/typography plugin in globals.css ([#14](https://github.com/fx/ui/issues/14)) ([a70aabe](https://github.com/fx/ui/commit/a70aabe38dcaf50b57dca9c41058619c1281deab))
* **theme:** use oklch colors and color-space agnostic theme mappings ([#7](https://github.com/fx/ui/issues/7)) ([7821307](https://github.com/fx/ui/commit/7821307bf53d88afb7d815258cbef7313823da37))
* **ui:** add clipboard commands and theme controls ([#22](https://github.com/fx/ui/issues/22)) ([a481115](https://github.com/fx/ui/commit/a4811151bf3f13671a18950919692b11d87aca85))
* **ui:** add component customization options ([#18](https://github.com/fx/ui/issues/18)) ([b228040](https://github.com/fx/ui/commit/b2280403bbb3a8690b7f99fb77526b6ec86925f8))
* **ui:** add confirmation and date range controls ([#20](https://github.com/fx/ui/issues/20)) ([b74a0a5](https://github.com/fx/ui/commit/b74a0a5ae74f2197ca823bac6747c25b449a6c9d))


### Bug Fixes

* **button:** keep native button props in the emitted ButtonProps type ([#15](https://github.com/fx/ui/issues/15)) ([6aa8396](https://github.com/fx/ui/commit/6aa839680e751b85fc9f84b1f792e26904165ae7))
* **date-range-fields:** fit narrow containers ([#23](https://github.com/fx/ui/issues/23)) ([92596bd](https://github.com/fx/ui/commit/92596bd1921b7273f8ad6d9050625fb50d312991))
* **date-range-fields:** match native controls to theme ([#24](https://github.com/fx/ui/issues/24)) ([5e435a1](https://github.com/fx/ui/commit/5e435a196644a3032717cd4c3f8ab8af00ad7cd8))
* floating components z-index above modals ([#8](https://github.com/fx/ui/issues/8)) ([057c4fc](https://github.com/fx/ui/commit/057c4fc08276f57e76782d99405bfb326de64b2d))
* **packaging:** generate reliable consumer styles and types ([#17](https://github.com/fx/ui/issues/17)) ([f94220a](https://github.com/fx/ui/commit/f94220a9e1d0fe8428da36d1de955a9371f7743a))
* **redacted:** use --color-* CSS variables for format-agnostic colors ([7f3e2cc](https://github.com/fx/ui/commit/7f3e2cc445768e8bb2d28fc841974564637dc79e))
* **styles:** ship tw-animate-css as a runtime dependency ([#16](https://github.com/fx/ui/issues/16)) ([8f9d443](https://github.com/fx/ui/commit/8f9d4439046f58b019cff022f3fd26523b8c5ac2))
* **ui:** improve overlay accessibility and declarations ([#19](https://github.com/fx/ui/issues/19)) ([a182422](https://github.com/fx/ui/commit/a1824225559b59cc684bc925f839ff297ef02e85))


### Miscellaneous

* add docs structure and skip CI on docs-only changes ([#10](https://github.com/fx/ui/issues/10)) ([8e5af40](https://github.com/fx/ui/commit/8e5af4030f41ae12e7c4926c44d1f9a728c3e471))


### Documentation

* add Tailwind v4 integration guide ([#13](https://github.com/fx/ui/issues/13)) ([e6bd2b6](https://github.com/fx/ui/commit/e6bd2b6c7a86451f0dae5535fa062cee1ed603ce))

## 1.0.0 (2026-03-15)


### Features

* add StreamerModeProvider and Redacted component for content privacy ([#4](https://github.com/fx/ui/issues/4)) ([2c80354](https://github.com/fx/ui/commit/2c8035454c6e843a5c5ad10d63af00a37b1732d8))
* **ci:** add preview package publishing ([#2](https://github.com/fx/ui/issues/2)) ([28fe5ad](https://github.com/fx/ui/commit/28fe5ad61b3723837f05b9a5caf59bb6a7666300))
* initial release ([b317f5b](https://github.com/fx/ui/commit/b317f5b0d8713b4ce0af3e1c51ac29d60741bcd7))
