<template>
  <div>

    <el-form :inline="true" :model="searchform" class="demo-form-inline">
      <el-row>
      <el-col :span="8">
        <el-form-item label="请假单编号">
        <el-input v-model="searchform.leaveNo" placeholder="请输入请假单编号"></el-input>
      </el-form-item>
      </el-col>
      <!-- 空白列，用于对齐 -->
      <el-col :span="8">
        <el-form-item label="请假原因">
        <el-input v-model="searchform.reason" placeholder="请输入请假原因"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="请假天数">
        <el-input v-model="searchform.hours" placeholder="请输入请假小时数"></el-input>
      </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="员工姓名">
        <!-- <el-input v-model="searchform.employeeId" placeholder="请选择员工姓名"></el-input> -->
        <el-select v-model="searchform.employeeId" clearable placeholder="请选择员工姓名">
            <el-option
              v-for="employee in employeeList"
              :key="employee.id"
              :label="employee.empName"
              :value="employee.id">
            </el-option>
          </el-select>

      </el-form-item>
      </el-col>
      <!-- 空白列，用于对齐 -->
      <el-col :span="8">
        <el-form-item label="请假类型">
        <!-- <el-input v-model="searchform.holidayType" placeholder="请选择请假类型"></el-input> -->

        <el-select v-model="searchform.holidayType" clearable placeholder="请选择请假类型">
            <el-option
              v-for="holidayType in holidayTypeList"
              :key="holidayType.id"
              :label="holidayType.name"
              :value="holidayType.id">
            </el-option>
          </el-select>
      </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="请假状态">
        <!-- <el-input v-model="searchform.status" placeholder="请选择请假状态"></el-input> -->
        <el-select v-model="searchform.status" clearable placeholder="请选择请假状态">
            <el-option
              v-for="status in statusList"
              :key="status.id"
              :label="status.name"
              :value="status.id">
            </el-option>
          </el-select>
      </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="请假开始日期">
        <!-- <el-input v-model="searchform.applyTime" placeholder="请输入请假日期"></el-input> -->
        <el-date-picker
            v-model="searchform.applyTimeBegin"
            type="date"
            placeholder="请输入请假开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
       
      </el-form-item>
      </el-col>
      <!-- 空白列，用于对齐 -->
      <el-col :span="8">
        <el-form-item label="请假结束日期">
        <!-- <el-input v-model="searchform.applyTime" placeholder="请输入请假日期"></el-input> -->
        <el-date-picker
            v-model="searchform.applyTimeEnd"
            type="date"
            placeholder="请输入请假结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
       
      </el-form-item>
      </el-col>
      <el-col :span="8">
      </el-col>
    </el-row>

    <el-row>
    <el-col :span="24" style="text-align: right; ">
      <el-form-item>
        <el-button type="primary" @click="fetchLeaves">查询</el-button>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" style="float: right; margin-bottom: 20px;" @click="handleAdd">
        新增请假条
      </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="float: right; margin-bottom: 20px;" @click="downloadExcel">导出请假单</el-button>
      </el-form-item>
    </el-col>
  </el-row>

    </el-form>


    <!-- 新增按钮 -->
    
    

    <!-- 请假条表格 -->
    <el-table :data="leaves" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="leaveNo" label="请假编号"></el-table-column>
      <el-table-column prop="reason" label="请假理由"></el-table-column>
      <el-table-column prop="hours" label="小时数"></el-table-column>
      <el-table-column prop="hospitalName" label="上级组织名称"></el-table-column>
      <el-table-column prop="className" label="科室名称"></el-table-column>
      <el-table-column prop="empName" label="员工姓名"></el-table-column>
      <!-- <el-table-column prop="holidayType" label="请假类型"></el-table-column> -->
      <el-table-column
      prop="holidayType"
      label="请假类型"
      :formatter="formatHolidayType" ></el-table-column>
      <el-table-column prop="startDate" label="开始日期"></el-table-column>
      <el-table-column prop="endDate" label="结束日期"></el-table-column>
      <el-table-column
      prop="status"
      label="状态"
      :formatter="formatStatus" ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="handleEdit(scope.row)">{{menuDisplayName(scope.row)}}</el-button>
          <el-button v-if="scope.row.status!==1" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status!==1" type="text" @click="handleAudit(scope.row)">确认</el-button>
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

    <!-- 新增/编辑请假条的弹窗 -->
    <el-dialog 
  :title="dialogTitle" 
  :visible.sync="dialogVisible"
  width="600px"
  top="8vh"
  :close-on-click-modal="false"
  custom-class="leave-dialog"
>
  <div class="dialog-content">
    <el-form 
      ref="form"
      :model="form" 
      :rules="rules"
      label-position="left"
      label-width="100px"
      class="enhanced-form"
    >
      <el-input v-model="form.id" type="hidden" />
      
      <el-row :gutter="20">
        <!-- 第一行：请假编号和请假类型 -->
        <el-col :span="12">
          <el-form-item label="请假编号" prop="leaveNo" class="form-item--enhanced">
            <el-input
              v-model="form.leaveNo"
              prefix-icon="el-icon-document"
              :disabled="true"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假类型" prop="holidayType" class="form-item--enhanced">
            <el-select
              v-model="form.holidayType"
              placeholder="请选择类型"
              prefix-icon="el-icon-collection-tag"
              filterable
            >
              <el-option
                v-for="type in holidayTypeList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 第二行：员工姓名和请假天数 -->
        <el-col :span="12">
          <el-form-item label="员工姓名" prop="employeeId" class="form-item--enhanced">
            <el-select
              v-model="form.employeeId"
              placeholder="请选择员工"
              prefix-icon="el-icon-user"
              filterable
            >
              <el-option
                v-for="emp in employeeList"
                :key="emp.id"
                :label="emp.empName"
                :value="emp.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假小时数" prop="hours" class="form-item--enhanced">
            <el-input
              v-model.number="form.hours"
              type="number"
              prefix-icon="el-icon-s-marketing"
              :readonly="true"
            >
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 第三行：请假开始日期和请假开始时间 -->
        <el-col :span="12">
          <el-form-item label="请假开始日期" prop="startDate" class="form-item--enhanced">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="选择开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              prefix-icon="el-icon-date"
              class="full-width-datepicker"  @change="getHours"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假开始时间" prop="startTime" class="form-item--enhanced">
            <el-time-picker
              v-model="form.startTime"
              placeholder="选择开始时间"
              format="HH:mm"
              value-format="HH:mm"
              prefix-icon="el-icon-time"
              class="full-width-timepicker"  @change="getHours"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 第四行：请假结束日期和请假结束时间 -->
        <el-col :span="12">
          <el-form-item label="请假结束日期" prop="endDate" class="form-item--enhanced">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              prefix-icon="el-icon-date"
              class="full-width-datepicker"  @change="getHours"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假结束时间" prop="endTime" class="form-item--enhanced">
            <el-time-picker
              v-model="form.endTime"
              placeholder="选择结束时间"
              format="HH:mm"
              value-format="HH:mm"
              prefix-icon="el-icon-time"
              class="full-width-timepicker"  @change="getHours"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 最后一行：请假理由 -->
        <el-col :span="24">
          <el-form-item label="请假理由" prop="reason" class="form-item--enhanced">
            <el-input
              v-model="form.reason"
              placeholder="请输入详细原因"
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              prefix-icon="el-icon-edit"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <template slot="footer">
    <div class="dialog-footer">
      <el-button 
        v-if="form.status != 1"
        @click="dialogVisible = false"
        class="cancel-btn"
      >取消</el-button>
      <el-button 
        v-if="form.status != 1"
        type="primary" 
        @click="handleSave"
        class="submit-btn"
      >保存</el-button>
      
      <div v-else class="status-tip">
        <i class="el-icon-warning"></i>
        该申请已确认，不可修改
      </div>
    </div>
  </template>
</el-dialog>
  </div>
</template>

<script>

import {get,post,del ,put} from '@/util/request'

export default {
  name: 'LeaveManagementPage',
  data() {
    return {
      leaves: [], // 请假单列表
      currentPage: 1, // 当前页码
      pageSize: 10,    // 每页显示条数
      total: 0, // 总记录数
      dialogVisible: false, // 控制弹窗显示
      dialogTitle: '新增科室', // 弹窗标题
      form: {
        id: null,
        leaveNo: '',
        reason: '',
        dayNum: '',
        employeeId: '',
        holidayType: '',
        status: '',
        applyTime:'',
        startDate:'2025-01-01',
        startTime:'00:00',
        endDate:'2025-01-01',
        endTime:'00:00',
        hours:'0'
      },

      searchform: {
        id: null,
        leaveNo: '',
        reason: '',
        dayNum: '',
        employeeId: '',
        holidayType: '',
        status: '',
        applyTime:'',
        applyTimeBegin:'',
        applyTimeEnd:''
      },

      employeeList: [], // 员工列表
      holidayTypeMap:{
        "1":"年休假",
        "2":"串休假"
      },
      holidayTypeList: [
        {id: 1,name: '年休假'},
        {id: 2,name: '串休假'}
      ],
      statusMap:{
        "0":"未确认",
        "1":"已确认"
      },

      statusList: [
        {id: 0,name: '未确认'},
        {id: 1,name: '已确认'}
      ],

      rules: {
        leaveNo: [
          { required: true, message: '请输入请假单编号', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入请假原因', trigger: 'blur' }
        ],
        hours: [
          { required: true, message: '请输入请假小时数', trigger: 'blur' }
        ],
        employeeId: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        holidayType: [
          { required: true, message: '请输入请假类型', trigger: 'blur' }
        ],
        applyTime: [
          { required: true, message: '请输入请假日期', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.fetchEmployeeList();
    this.fetchLeaves(); // 页面加载时查询科室列表
  },
  computed: {
      // 计算当前页显示的数据
      paginatedLeaves() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.leaves.slice(start, end);
      },

    },
  methods: {

    getCurrentTimestamp() {
      // 获取当前日期和时间
      const now = new Date();

      // 提取年份、月份、日期、小时、分钟、秒和毫秒
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且补零
      const day = String(now.getDate()).padStart(2, '0');       // 日期补零
      const hours = String(now.getHours()).padStart(2, '0');    // 小时补零
      const minutes = String(now.getMinutes()).padStart(2, '0'); // 分钟补零
      const seconds = String(now.getSeconds()).padStart(2, '0'); // 秒补零
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // 毫秒补零至三位

      // 组装时间戳字符串
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

      return timestamp;
  },

    menuDisplayName(row){
      return row.status!==1?'编辑':'查看'
    },

    formatHolidayType(row, column, cellValue) {
      let v = this.holidayTypeMap[cellValue] || '未知类型' // 返回科室名称
      return v;
    },
    formatStatus(row, column, cellValue) {
      let v = this.statusMap[cellValue] || '未知状态' // 返回科室名称
      return v;
    },

    // 查询科室列表
    async fetchLeaves() {

       const loadingInstance = this.$loading({
               lock: true,
               text: '加载中...', // 加载提示文字
               spinner: 'el-icon-loading', // 加载图标
               background: 'rgba(173, 216, 230, 0.7)' // 背景颜色
             });


      try {
          const response = await get('/api/leaves/query', {
            current: this.currentPage,
              size: this.pageSize,
              leaveNo: this.searchform.leaveNo,
              reason: this.searchform.reason,
              dayNum: this.searchform.dayNum,
              employeeId: this.searchform.employeeId,
              holidayType: this.searchform.holidayType,
              status: this.searchform.status,
              applyTimeBegin: this.searchform.applyTimeBegin,
              applyTimeEnd: this.searchform.applyTimeEnd
          });
          if (response.code === 200) {
            this.leaves = response.data.records; // 更新科室数据
            this.total = response.data.total; // 更新总记录数
          } else {
            console.error('数据加载失败:', response.message);
          }
        } catch (error) {
          console.error('请求失败:', error);
        } finally{

            loadingInstance.close(); // 关闭加载提示

        }
    },


    

    // 打开新增科室弹窗
    handleAdd() {
      this.dialogTitle = '新增请假条';
      this.form= {
        id: null,
        leaveNo: this.getCurrentTimestamp(),
        reason: '',
        dayNum: 0,
        employeeId: '',
        holidayType: '',
        applyTime:'',
        startDate:'2025-01-01',
        startTime:'00:00',
        endDate:'2025-01-01',
        endTime:'00:00',
        hours:'0'
      };
      this.dialogVisible = true;
    },

    // 打开编辑请假条弹窗
    async handleEdit(row) {
      
      try {
        const response = await get(`/api/leaves/get/${row.id}`);
        this.form = response.data;
        this.dialogTitle = row.status!=1?'编辑请假条':'查看请假条';
        this.dialogVisible = true;
      } catch (error) {
        console.error('获取请假条信息失败:', error);
        this.$message.error('获取请假条信息失败');
      }
    },

    // 保存请假条（新增或编辑）
    async handleSave() {

      let myvalid = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          myvalid = true;
        }
      });
      if(!myvalid) return ;


        const loadingInstance = this.$loading({
                       lock: true,
                       text: '加载中...', // 加载提示文字
                       spinner: 'el-icon-loading', // 加载图标
                       background: 'rgba(173, 216, 230, 0.7)' // 背景颜色
                     });


      try {
        const url = '/api/leaves/save';
        await post(url, this.form);
        this.$message.success('保存成功');
        this.dialogVisible = false;
        this.fetchLeaves(); // 刷新请假条列表
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        loadingInstance.close(); // 关闭加载提示
      }
    },

    // 删除请假条
    async handleDelete(row) {
      
      try {
        await del(`/api/leaves/delete/${row.id}`);
        this.$message.success('删除成功');
        this.fetchLeaves(); // 刷新请假条列表
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },

     // 删除请假条
     async handleAudit(row) {

        // 显示顶部导航栏加载动画
      const loadingInstance = this.$loading({
        lock: true,
        text: '确认中...', // 加载提示文字
        spinner: 'el-icon-loading', // 加载图标
        background: 'rgba(173, 216, 230, 0.7)' // 背景颜色
      });

        try{
        await put(`/api/leaves/audit/${row.id}`);
        this.$message.success('确认成功');
        this.fetchLeaves(); // 刷新请假条列表
        } catch (error) {
          console.error('确认失败:', error);
        }finally{
        loadingInstance.close(); // 关闭加载动画
        }
    },

    async getHours(){


        const loadingInstance = this.$loading({
                               lock: true,
                               text: '加载中...', // 加载提示文字
                               spinner: 'el-icon-loading', // 加载图标
                               background: 'rgba(173, 216, 230, 0.7)' // 背景颜色
                             });

        const {startDate, endDate,startTime,endTime} = this.form
        try {
           const response =  await get(`/api/leaves/get-leave-hours`,{
              a: startDate+'T'+startTime,
              b: endDate+'T'+endTime
          });

            if (response.code === 200) {
                this.form.hours = response.data
            }

          } catch (error) {
            console.error('确认失败:', error);
            this.$message.error('确认失败');
          } finally {
            loadingInstance.close(); // 关闭加载动画
          }
    },


    // 每页大小变化
    async handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
      this.fetchLeaves(); // 重新加载数据
    },

    // 当前页码变化
    async handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchLeaves(); // 重新加载数据
    },


    async fetchEmployeeList() {
      try {
        const response = await get(`/api/employee/list-all`);
        this.employeeList = response.data; // 假设接口返回的数据格式为 [{ id: 1, name: '张三' }, ...]
      } catch (error) {
        console.error('获取员工列表失败:', error);
      }
    },


    async downloadExcel() {
  try {
    // 发送请求，设置 responseType 为 'blob'
    const response = await post('/api/leaves/download-file', null, {
      responseType: 'blob' // 确保 responseType 正确设置
    });

    // 检查响应头中的 Content-Type
    const contentType = response.headers['content-type'];
    let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // 默认类型
    let fileExtension = 'xls'; // 默认文件扩展名

    // 根据 Content-Type 调整文件类型和扩展名
    if (contentType.includes('application/vnd.ms-excel')) {
      fileType = 'application/vnd.ms-excel';
      fileExtension = 'xls';
    }

    // 创建一个 Blob 对象
    const blob = new Blob([response.data], {
      type: fileType // 根据 Content-Type 设置正确的 MIME 类型
    });

    // 创建一个临时链接
    const url = window.URL.createObjectURL(blob);

    // 创建一个 <a> 标签
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report.${fileExtension}`); // 根据文件类型设置正确的扩展名
    document.body.appendChild(link);

    // 触发下载
    link.click();

    // 移除 <a> 标签
    document.body.removeChild(link);

    // 释放 Blob URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载失败:', error);
    this.$message.error('文件下载失败，请稍后重试');
  }
}
    


  },
};
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}

.leave-dialog {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  ::v-deep .el-dialog__header {
    background: linear-gradient(135deg, #67C23A, #409EFF);
    border-radius: 12px 12px 0 0;
    padding: 20px 32px;

    .el-dialog__title {
      color: #fff;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 1px;
    }

    .el-dialog__headerbtn {
      top: 22px;
      right: 30px;
      
      .el-dialog__close {
        color: rgba(255,255,255,0.9);
        font-size: 22px;
      }
    }
  }

  .dialog-content {
    padding: 24px 36px 0;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.enhanced-form {
  .form-item--enhanced {
    margin-bottom: 22px;

    ::v-deep .el-form-item__label {
      color: #606266;
      font-weight: 500;
      padding-right: 16px;
    }

    .el-input, .el-select, .el-date-editor {
      width: 100%;
      
      &__inner {
        height: 42px;
        line-height: 42px;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          border-color: #67C23A;
          box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
        }

        &:focus-within {
          border-color: #409EFF;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
        }
      }

      &__prefix {
        left: 14px;
        i {
          font-size: 18px;
          color: #909399;
        }
      }
    }

    .el-textarea {
      &__inner {
        min-height: 80px !important;
        padding: 12px 16px;
        line-height: 1.5;
      }
    }

    .full-width-datepicker {
      width: 100%;
    }
  }
}

.dialog-footer {
  padding: 20px 32px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cancel-btn {
    padding: 10px 26px;
    border-radius: 6px;
    &:hover {
      color: #67C23A;
      border-color: #e1f3d8;
      background-color: #f0f9eb;
    }
  }

  .submit-btn {
    padding: 10px 32px;
    border-radius: 6px;
    letter-spacing: 1px;
    transition: all 0.3s;
    
    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }

  .status-tip {
    color: #E6A23C;
    font-size: 14px;
    i {
      margin-right: 8px;
    }
  }
}

@media (max-width: 768px) {
  .leave-dialog {
    width: 90% !important;
    top: 5vh;
    
    .dialog-content {
      padding: 16px 20px 0;
    }
    
    ::v-deep .el-dialog__header {
      padding: 16px 20px;
    }
    
    .dialog-footer {
      padding: 16px 20px;
    }
  }
}
</style>