<template>
  <div>
    <el-form :inline="true" :model="searchform" class="demo-form-inline">
    
    <el-row>
      <el-col :span="8">
        <el-form-item label="科室编号">
        <el-input v-model="searchform.classNo" placeholder="请输入科室编号"></el-input>
      </el-form-item>
      </el-col>
      <!-- 空白列，用于对齐 -->
      <el-col :span="8">
        <el-form-item label="科室名称">
        <el-input v-model="searchform.className" placeholder="请输入科室名称"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="医院名称">
        <el-input v-model="searchform.hospitalName" placeholder="请输入医院名称"></el-input>
      </el-form-item>
      </el-col>
    </el-row>
  
  <el-row>
    <el-col :span="24" style="text-align: right; ">
      <el-form-item>
        <el-button type="primary" @click="fetchDepartments">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增科室</el-button>
      </el-form-item>
    </el-col>
  </el-row>


    </el-form>
    <!-- 科室表格 -->
    <el-table :data="departments" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="classNo" label="科室编号"></el-table-column>
      <el-table-column prop="className" label="科室名称"></el-table-column>
      <el-table-column prop="hospitalName" label="医院名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>

    <!-- 新增/编辑科室的弹窗 -->
    <el-dialog 
  :title="dialogTitle" 
  :visible.sync="dialogVisible" 
  :close-on-click-modal="false"
  width="600px"
  top="8vh"
  custom-class="custom-dialog"
>
  <!-- 使用弹性盒模型布局 -->
  <div class="dialog-content">
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="form" 
      label-position="left"
      label-width="100px"
      class="elegant-form"
    >
      <el-input v-model="form.id" type="hidden"></el-input>
      
      <!-- 表单项使用栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item 
            label="科室编号" 
            prop="classNo"
            class="form-item-enhanced"
          >
            <el-input 
              v-model="form.classNo"
              placeholder="请输入科室编号"
              clearable
              prefix-icon="el-icon-office-building"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item 
            label="科室名称" 
            prop="className"
            class="form-item-enhanced"
          >
            <el-input 
              v-model="form.className"
              placeholder="请输入科室名称"
              clearable
              prefix-icon="el-icon-s-management"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item 
            label="医院名称" 
            prop="hospitalName"
            class="form-item-enhanced"
          >
            <el-input 
              v-model="form.hospitalName"
              placeholder="请输入所属医院名称"
              clearable
              prefix-icon="el-icon-hospital"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <!-- 底部按钮优化 -->
  <template slot="footer">
    <div class="dialog-footer-actions">
      <el-button 
        @click="dialogVisible = false" 
        class="cancel-btn"
      >取消</el-button>
      <el-button 
        type="primary" 
        @click="handleSave"
        class="submit-btn"
      >保存</el-button>
    </div>
  </template>
</el-dialog>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DepartmentManagementPage',
  data() {
    return {
      departments: [], // 科室列表
      currentPage: 1, // 当前页码
      pageSize: 10,    // 每页显示条数
      total: 0, // 总记录数
      dialogVisible: false, // 控制弹窗显示
      dialogTitle: '新增科室', // 弹窗标题
      form: {
        id: null,
        classNo: null,
        className: '',
        hospitalName: '',
      },
      searchform: {
        id: null,
        classNo: null,
        className: '',
        hospitalName: '',
      },

      rules: {
        classNo: [
          { required: true, message: '请输入科室编号', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ],
        hospitalName: [
          { required: true, message: '请输入医院名称', trigger: 'blur' }
        ]
      }

    };
  },

  mounted() {
    this.fetchDepartments(); // 页面加载时查询科室列表
  },

  computed: {
    // 计算当前页显示的数据
    paginatedDepartments() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.departments.slice(start, end);
    }
  },
  
  methods: {
    // 查询科室列表
    async fetchDepartments() {
      try {
          const response = await axios.get('/api/classes/query', {
            params: {
              current: this.currentPage,
              size: this.pageSize,
              classNo: this.searchform.classNo,
              className: this.searchform.className,
              hospitalName: this.searchform.hospitalName
            },
          });
          if (response.data.code === 200) {
            this.departments = response.data.data.records; // 更新科室数据
            this.total = response.data.data.total; // 更新总记录数
          } else {
            console.error('数据加载失败:', response.data.message);
          }
        } catch (error) {
          console.error('请求失败:', error);
        }
    },

    // 打开新增科室弹窗
    handleAdd() {
      this.dialogTitle = '新增科室';
      this.form= {
              id: null,
              classNo: '',
              className: '',
              hospitalName: '',
            };
      this.dialogVisible = true;
    },

    // 打开编辑科室弹窗
    async handleEdit(row) {
      try {
        const response = await axios.get(`/api/classes/get/${row.id}`);
        this.form = response.data.data;
        this.dialogTitle = '编辑科室';
        this.dialogVisible = true;
      } catch (error) {
        console.error('获取科室信息失败:', error);
        this.$message.error('获取科室信息失败');
      }
    },
    
    // 保存科室（新增或编辑）
    async handleSave() {
      let myvalid = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          myvalid = true;
        }
      });
      if(!myvalid) return ;
      try {
        const url = '/api/classes/save';
        await axios.post(url, this.form);
        this.$message.success('保存成功');
        this.dialogVisible = false;
        this.fetchDepartments(); // 刷新科室列表
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      }
    },

    // 删除科室
    async handleDelete(row) {
      try {
        await axios.delete(`/api/classes/delete/${row.id}`);
        this.$message.success('删除成功');
        this.fetchDepartments(); // 刷新科室列表
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },

    // 每页大小变化
    async handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
      this.fetchDepartments(); // 重新加载数据
    },

    // 当前页码变化
    async handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchDepartments(); // 重新加载数据
    },


  },
};
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}



.custom-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  ::v-deep .el-dialog__header {
    background: linear-gradient(135deg, #409EFF, #337ecc);
    border-radius: 8px 8px 0 0;
    padding: 16px 24px;

    .el-dialog__title {
      color: #fff;
      font-weight: 600;
      font-size: 18px;
    }

    .el-dialog__headerbtn {
      top: 16px;
      .el-dialog__close {
        color: #fff;
      }
    }
  }

  .dialog-content {
    padding: 24px 32px;
  }
}


.elegant-form {
  .form-item-enhanced {
    margin-bottom: 22px;

    ::v-deep .el-form-item__label {
      color: #606266;
      font-weight: 500;
      padding-right: 12px;
    }

    .el-input {
      &__inner {
        border-radius: 4px;
        transition: border-color 0.3s;

        &:hover {
          border-color: #409EFF;
        }

        &:focus {
          box-shadow: 0 0 4px rgba(64, 158, 255, 0.3);
        }
      }

      &__prefix {
        left: 10px;
        i {
          font-size: 16px;
          color: #909399;
        }
      }
    }
  }
}


.dialog-footer-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;

  .cancel-btn {
    margin-right: 12px;
    padding: 10px 20px;
    border-radius: 4px;
  }

  .submit-btn {
    padding: 10px 24px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
    }
  }
}
</style>