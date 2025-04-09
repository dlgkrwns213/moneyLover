import { defineStore } from 'pinia'
import axios from 'axios'

export const useSavingStore = defineStore('saving', {
  state: () => ({
    savings: [],
    loading: false,
    error: null,
    currentSaving: null,
  }),
  actions: {
    async addSaving(newSaving) {
        this.loading = true
        try {
          const res = await axios.post('http://localhost:3000/saving', newSaving)
          this.savings.push(res.data)
          this.error = null
          return res.data.id // 이 줄 추가!!
        } catch (err) {
          this.error = err
          console.error('저축 추가 실패:', err)
          throw err
        } finally {
          this.loading = false
        }
      },
    async fetchSavings(userId) {
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:3000/saving?userId=${userId}`)
        this.savings = res.data
        this.error = null
      } catch (err) {
        this.error = err
        console.error('저축 목록 불러오기 실패:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchSavingById(id) {
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:3000/saving/${id}`)
        this.currentSaving = res.data
        this.error = null
      } catch (err) {
        this.error = err
        console.error('저축 상세 불러오기 실패:', err)
      } finally {
        this.loading = false
      }
    },

    async deleteSaving(id) {
      this.loading = true
      try {
        await axios.delete(`http://localhost:3000/saving/${id}`)
        this.savings = this.savings.filter(s => s.id !== id)
        this.error = null
      } catch (err) {
        this.error = err
        console.error('저축 삭제 실패:', err)
      } finally {
        this.loading = false
      }
    },
    async toggleScheduleCheck(index) {
        if (!this.currentSaving?.schedule) return
      
        // 상태 토글
        this.currentSaving.schedule[index].done = !this.currentSaving.schedule[index].done
      
        // ✅ 새로 저장된 금액 계산
        const saved = this.currentSaving.schedule
          .filter(item => item.done)
          .reduce((sum, item) => sum + item.amount, 0)
      
        // ✅ 퍼센트 계산
        const percent = Math.floor((saved / this.currentSaving.targetAmount) * 100)
      
        // 상태 업데이트
        this.currentSaving.saved = saved
        this.currentSaving.percent = percent
      
        try {
          // 서버에 PATCH
          await axios.patch(`http://localhost:3000/saving/${this.currentSaving.id}`, {
            schedule: this.currentSaving.schedule,
            saved: saved,
            percent: percent,
          })
        } catch (err) {
          console.error('스케줄 상태 저장 실패:', err)
        }
      }
      
      
      
  }
})
