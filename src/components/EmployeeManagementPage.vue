<template>
  <div>
    <el-form :inline="true" :model="searchform" class="demo-form-inline">
  <el-row>
    <el-col :span="8">
      <el-form-item label="员工号">
        <el-input v-model="searchform.empNo" placeholder="请输入员工号"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="科室名称">
        <!-- <el-input v-model="searchform.classId" placeholder="请选择科室名称"></el-input> -->
        <el-select v-model="searchform.classId" clearable placeholder="请选择科室名称">
          <el-option
            v-for="classes in classesList"
            :key="classes.id"
            :label="classes.className"
            :value="classes.id">
          </el-option>
        </el-select>
      </el-form-item>      
    </el-col>
    <el-col :span="8">
      <el-form-item label="员工姓名">
        <el-input v-model="searchform.empName" placeholder="请输入员工姓名"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8">
      <el-form-item label="员工性别">
        <!-- <el-input v-model="searchform.sex" placeholder="请选择员工性别"></el-input> -->
        <el-select v-model="searchform.sex" clearable placeholder="请选择员工性别">
            <el-option
              v-for="sex in sexesList"
              :key="sex.id"
              :label="sex.name"
              :value="sex.id">
            </el-option>
          </el-select>

      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="通讯地址">
        <el-input v-model="searchform.address" placeholder="请输入通讯地址"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="员工电话">
        <el-input v-model="searchform.empTel" placeholder="请输入员工电话"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  
  <el-row>
    <el-col :span="8">
      <el-form-item label="联系人">
        <el-input v-model="searchform.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="联系人电话">
        <el-input v-model="searchform.contactTel" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="年休天数">
        <el-input v-model="searchform.yearHolidays" placeholder="请输入年休天数" type="number"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  
  <el-row>
    <el-col :span="8">
      <el-form-item label="串休天数">
        <el-input v-model="searchform.otherHolidays" placeholder="请输入串休天数" type="number"></el-input>
      </el-form-item>
    </el-col>
    <!-- 空白列，用于对齐 -->
    <el-col :span="8"></el-col>
    <el-col :span="8">
    </el-col>
  </el-row>
  
  <el-row>
    <el-col :span="24" style="text-align: right; ">
      <el-form-item>
        <el-button type="primary" @click="fetchEmployees">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增员工</el-button>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>


    <!-- 科室表格 -->
    <el-table v-if="!loading" :data="employees" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="empNo" label="员工编号"></el-table-column>
      <!-- <el-table-column prop="classId" label="科室编号"></el-table-column> -->
      <el-table-column
      prop="classId"
      label="科室名称"
      :formatter="formatDepartment" ></el-table-column>
      <el-table-column prop="empName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column
      prop="sex"
      label="性别"
      :formatter="formatSex" ></el-table-column>
      <el-table-column prop="address" label="通讯地址"></el-table-column>
      <el-table-column prop="empTel" label="电话"></el-table-column>
      <el-table-column prop="contact" label="联系人"></el-table-column>
      <el-table-column prop="contactTel" label="联系人电话"></el-table-column>
      <el-table-column prop="yearHolidays" label="年假天数"></el-table-column>
      <el-table-column prop="otherHolidays" label="串休天数"></el-table-column>

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

    <!-- 新增/编辑员工的弹窗 -->
    <el-dialog 
  :title="dialogTitle" 
  :visible.sync="dialogVisible" 
  width="720px"
  top="6vh"
  :close-on-click-modal="false"
  custom-class="staff-dialog"
>
  <div class="dialog-content">
    <el-form 
      ref="form"
      :model="form" 
      :rules="rules"
      label-position="left"
      label-width="100px"
      class="staff-form"
    >
      <el-input v-model="form.id" type="hidden" />
      
      <!-- 使用双列栅格布局 -->
      <el-row :gutter="30">
        <!-- 左侧列 -->
        <el-col :span="12">
          <el-form-item label="员工编号" prop="empNo" class="form-item-enhanced">
            <el-input 
              v-model="form.empNo"
              placeholder="请输入员工编号"
              prefix-icon="el-icon-user"
              clearable
            />
          </el-form-item>

          <el-form-item label="科室名称" prop="classId" class="form-item-enhanced">
            <el-select 
              v-model="form.classId"
              placeholder="请选择科室"
              prefix-icon="el-icon-office-building"
              filterable
            >
              <el-option
                v-for="classes in classesList"
                :key="classes.id"
                :label="classes.className"
                :value="classes.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="员工姓名" prop="empName" class="form-item-enhanced">
            <el-input 
              v-model="form.empName"
              placeholder="请输入姓名"
              prefix-icon="el-icon-edit"
              clearable
            />
          </el-form-item>

          <el-form-item label="性别" prop="sex" class="form-item-enhanced">
            <el-select 
              v-model="form.sex"
              placeholder="请选择性别"
              prefix-icon="el-icon-female"
            >
              <el-option
                v-for="sex in sexesList"
                :key="sex.id"
                :label="sex.name"
                :value="sex.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 右侧列 -->
        <el-col :span="12">
          <el-form-item label="通讯地址" prop="address" class="form-item-enhanced">
            <el-input 
              v-model="form.address"
              placeholder="请输入详细地址"
              prefix-icon="el-icon-location"
              clearable
            />
          </el-form-item>

          <el-form-item label="电话" prop="empTel" class="form-item-enhanced">
            <el-input 
              v-model="form.empTel"
              placeholder="请输入11位手机号"
              prefix-icon="el-icon-phone"
              clearable
              maxlength="11"
            />
          </el-form-item>

          <el-form-item label="联系人" prop="contact" class="form-item-enhanced">
            <el-input 
              v-model="form.contact"
              placeholder="请输入紧急联系人"
              prefix-icon="el-icon-link"
              clearable
            />
          </el-form-item>

          <el-form-item label="联系电话" prop="contactTel" class="form-item-enhanced">
            <el-input 
              v-model="form.contactTel"
              placeholder="请输入联系人电话"
              prefix-icon="el-icon-mobile-phone"
              clearable
              maxlength="11"
            />
          </el-form-item>

          <div class="inline-group">
            <el-form-item label="年休天数" prop="yearHolidays" class="form-item-enhanced">
              <el-input 
                v-model="form.yearHolidays"
                placeholder="0"
                type="number"
                min="0"
                class="number-input"
              />
            </el-form-item>
            
            <el-form-item label="串休天数" prop="otherHolidays" class="form-item-enhanced">
              <el-input 
                v-model="form.otherHolidays"
                placeholder="0"
                type="number"
                min="0"
                class="number-input"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <!-- 底部按钮组 -->
  <template slot="footer">
    <div class="dialog-footer">
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
  name: 'EmployeementManagementPage',
  data() {
    return {
      employees: [], // 员工列表
      currentPage: 1, // 当前页码
      pageSize: 10,    // 每页显示条数
      total: 0, // 总记录数
      dialogVisible: false, // 控制弹窗显示
      dialogTitle: '新增员工', // 弹窗标题
      form: {
        id: null,
        empNo: '',
        classId: '',
        empName: '',
        sex: '',
        address: '',
        empTel: '',
        contact: '',
        contactTel: '',
        yearHolidays: '',
        otherHolidays: '',
      },

      searchform: {
        id: null,
        empNo: '',
        classId: '',
        empName: '',
        sex: '',
        address: '',
        empTel: '',
        contact: '',
        contactTel: '',
        yearHolidays: '',
        otherHolidays: '',
      },

      classesList: [],
      sexesList: [
        {id: 0,name: '男'},
        {id: 1,name: '女'}
      ],
      departmentMap:{},
      sexMap:{
        "0":"男",
        "1":"女"
      },
      loading: true,

      rules: {
        empNo: [
          { required: true, message: '请输入员工编号', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ],
        empName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入员工性别', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入通讯地址', trigger: 'blur' }
        ],
        empTel: [
          { required: true, message: '请输入员工电话', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        yearHolidays: [
          { required: true, message: '请输入年休天数', trigger: 'blur' }
        ],
        otherHolidays: [
          { required: true, message: '请输入串休天数', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.loading = true
    this.fetchEmployees(); // 页面加载时查询科室列表
    this.fetchClassesList();
    this.loading=false
  },
  computed: {
     
    },
  methods: {
  async fetchDepartmentMap() {
      try {
        this.departmentMap = this.classesList.reduce((map, department) => {
          map[department.id] = department.className;
          return map;
        }, {});
      } catch (error) {
        console.error('加载科室码表失败:', error);
      } 
    },

     // 格式化科室编号
     formatDepartment(row, column, cellValue) {
      let v = this.departmentMap[cellValue] || '未知科室' // 返回科室名称
      return v;
    },
    formatSex(row, column, cellValue) {
      let v = this.sexMap[cellValue] || '未知科室' // 返回科室名称
      return v;
    },
    // 查询科室列表
    async fetchEmployees() {
      try {
          const response = await axios.get('/api/employee/query', {
            params: {
              current: this.currentPage,
              size: this.pageSize,

              empNo: this.searchform.empNo,
              classId: this.searchform.classId,
              empName: this.searchform.empName,
              sex: this.searchform.sex,
              address: this.searchform.address,
              empTel: this.searchform.empTel,
              contact: this.searchform.contact,
              contactTel: this.searchform.contactTel,
              yearHolidays: this.searchform.yearHolidays,
              otherHolidays: this.searchform.otherHolidays,
    
            },
          });
          if (response.data.code === 200) {
            this.employees = response.data.data.records; // 更新科室数据
            this.total = response.data.data.total; // 更新总记录数
          } else {
            console.error('数据加载失败:', response.data.message);
          }
        } catch (error) {
          console.error('请求失败:', error);
        }
    },

    // 打开新增员工弹窗
    handleAdd() {
      this.dialogTitle = '新增员工';
      this.form= {
         id: null,
         empNo: '',
         classId: '',
         empName: '',
         sex: '',
         address: '',
         empTel: '',
         contact: '',
         contactTel: '',
         yearHolidays: '',
         otherHolidays: '',
       };
      this.dialogVisible = true;
    },

    // 打开编辑员工弹窗
    async handleEdit(row) {
      try {
        const response = await axios.get(`/api/employee/get/${row.id}`);
        this.form = response.data.data;
        this.dialogTitle = '编辑员工';
        this.dialogVisible = true;
      } catch (error) {
        console.error('获取科室信息失败:', error);
        this.$message.error('获取科室信息失败');
      }
    },

    // 保存员工（新增或编辑）
    async handleSave() {

      let myvalid = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          myvalid = true;
        }
      });
      if(!myvalid) return ;


      try {
        const url = '/api/employee/save';
        await axios.post(url, this.form);
        this.$message.success('保存成功');
        this.dialogVisible = false;
        this.fetchEmployees(); // 刷新员工列表
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      }
    },

    // 删除科室
    async handleDelete(row) {
      try {
        await axios.delete(`/api/employee/delete/${row.id}`);
        this.$message.success('删除成功');
        this.fetchEmployees(); // 刷新科室列表
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },

    // 每页大小变化
    async handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
      this.fetchEmployees(); // 重新加载数据
    },

    // 当前页码变化
    async handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchEmployees(); // 重新加载数据
    },

    async fetchClassesList() {
      try {
        const response = await axios.get(`/api/classes/list-all`);
        this.classesList = response.data.data; // 假设接口返回的数据格式为 [{ id: 1, name: '张三' }, ...]
        this.fetchDepartmentMap();
      } catch (error) {
        console.error('获取员工列表失败:', error);
      }
    },
  },

  

};
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}

.staff-dialog {
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

  ::v-deep .el-dialog__header {
    background: linear-gradient(135deg, #409EFF, #67C23A);
    border-radius: 10px 10px 0 0;
    padding: 18px 28px;

    .el-dialog__title {
      color: #fff;
      font-size: 20px;
      letter-spacing: 1px;
    }

    .el-dialog__headerbtn {
      top: 20px;
      .el-dialog__close {
        color: rgba(255,255,255,0.9);
        font-size: 20px;
      }
    }
  }

  .dialog-content {
    padding: 24px 32px 0;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.staff-form {
  .form-item-enhanced {
    margin-bottom: 20px;

    ::v-deep .el-form-item__label {
      color: #606266;
      font-weight: 500;
      padding-right: 15px;
    }

    .el-input, .el-select {
      width: 100%;
      
      &__inner {
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          border-color: #409EFF;
          box-shadow: 0 2px 6px rgba(64, 158, 255, 0.1);
        }

        &::placeholder {
          color: #C0C4CC;
        }
      }

      &__prefix {
        left: 12px;
        i {
          font-size: 16px;
          color: #909399;
        }
      }
    }

    .el-select-dropdown__item {
      padding: 0 20px;
    }
  }

  .inline-group {
    display: flex;
    gap: 15px;
    
    .form-item-enhanced {
      flex: 1;
      
      ::v-deep .el-form-item__content {
        display: flex;
        align-items: center;
      }
      
      .number-input {
        .el-input__inner {
          text-align: right;
          padding-right: 15px;
        }
      }
    }
  }
}

.dialog-footer {
  padding: 16px 28px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .cancel-btn {
    padding: 10px 24px;
    border-radius: 6px;
    &:hover {
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }

  .submit-btn {
    padding: 10px 28px;
    border-radius: 6px;
    letter-spacing: 1px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }
}
</style>