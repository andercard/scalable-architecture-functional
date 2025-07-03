<template>
  <el-header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <router-link to="/" class="logo">
          <h1>AnimeExplorer</h1>
        </router-link>
      </div>
      
      <div class="header-right">
        <template v-if="isAuthenticated">
          <el-dropdown data-test="dropdown:user-menu" @command="handleCommand">
            <el-avatar :src="user?.avatar" :size="40">
              {{ user?.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item data-test="menu-item:favorites" command="favorites">
                  <el-icon><Star /></el-icon>
                  Favoritos
                </el-dropdown-item>
                <el-dropdown-item data-test="menu-item:logout" divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  Cerrar Sesión
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        
        <template v-else>
          <el-button 
            data-test="button:login" 
            type="primary" 
            @click="$router.push('/login')"
          >
            Iniciar Sesión
          </el-button>
          <el-button 
            data-test="button:register" 
            @click="$router.push('/register')"
          >
            Registrarse
          </el-button>
        </template>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Star, SwitchButton } from '@element-plus/icons-vue'
import { useAppHeader } from './useAppHeader'

const {
  isAuthenticated,
  user,
  handleCommand
} = useAppHeader()
</script>

<style scoped>
@import './AppHeader.styles.scss';
</style> 