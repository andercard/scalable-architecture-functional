import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: [['verbose', { summary: true }]],
      
      // Timeouts optimizados
      testTimeout: 10000,
      hookTimeout: 10000,
      
      // Configuración de coverage mejorada
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        
        // Lista de exclusiones mejorada basada en mejores prácticas 2024/2025
        exclude: [
          'node_modules/',
          'test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          'dist/',
          'build/',
          'public/',
          // Patrones específicos para proyectos Vue
          '**/*.stories.{js,jsx,ts,tsx}',
          '**/*.story.{js,jsx,ts,tsx}',
          '**/mock/**',
          '**/mocks/**',
          '**/__mocks__/**',
          '**/test-utils/**',
          '**/factories/**',
          '**/fixtures/**',
          // Archivos de configuración específicos
          'vite.config.ts',
          'vitest.config.ts',
          'tsconfig.json',
          'tsconfig.*.json',
          'eslint.config.js',
          // Archivos de entrada
          'src/main.ts',
          'src/App.vue',
          // Archivos de tipos y constantes
          '**/types.ts',
          '**/constants.ts',
          '**/index.ts', // Solo exports
          // Archivos de estilo
          '**/*.scss',
          '**/*.sass',
        ],
        
        // Thresholds más realistas para proyectos en desarrollo
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
          }
        }
      },
      
      // Configuración de deps.optimizer simplificada
      deps: {
        optimizer: {
          web: {
            enabled: true,
            include: [
              // Solo dependencias que realmente existen en el proyecto
              '@vue/test-utils',
              '@testing-library/vue',
              '@testing-library/user-event',
              '@pinia/testing',
              'element-plus',
              '@element-plus/icons-vue',
              '@vueuse/core',
            ],
          },
        },
      },
      
      // Configuración de entorno mejorada
      environmentOptions: {
        jsdom: {
          resources: 'usable',
          runScripts: 'dangerously',
        }
      },
    },
  })
) 