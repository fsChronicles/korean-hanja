// 데이터 로드 및 초기화
let hanjaData = [];

// 데이터 로드
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // 동일 한자+음+뜻 조합을 그룹화하여 번호 붙이기
        const grouped = {};
        data.forEach(item => {
            const key = `${item.한자}-${item.음}-${item.뜻}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });

        // 각 그룹에서 2개 이상인 경우 번호 붙이기
        Object.values(grouped).forEach(group => {
            if (group.length > 1) {
                group.forEach((item, index) => {
                    // 이미 번호가 붙어있지 않은 경우에만 번호 추가
                    if (!item.구분.includes(' - ')) {
                        item.구분 = `${item.구분} - ${index + 1}`;
                    }
                });
            }
        });

        hanjaData = data;
        displayData(hanjaData);
    })
    .catch(error => {
        console.error('데이터 로드 실패:', error);
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="7" style="text-align:center;">데이터를 불러올 수 없습니다.</td></tr>';
    });

// 검색 및 필터
const searchInput = document.getElementById('searchInput');
const educationFilter = document.getElementById('educationFilter');
const gradeFilter = document.getElementById('gradeFilter');
const lengthFilter = document.getElementById('lengthFilter');

// 이벤트 리스너
searchInput.addEventListener('input', filterData);
educationFilter.addEventListener('change', filterData);
gradeFilter.addEventListener('change', filterData);
lengthFilter.addEventListener('change', filterData);

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const education = educationFilter.value;
    const grade = gradeFilter.value;
    const length = lengthFilter.value;

    const filtered = hanjaData.filter(item => {
        const matchSearch = !searchTerm ||
            item.한자.includes(searchTerm) ||
            item.음.toLowerCase().includes(searchTerm) ||
            item.뜻.toLowerCase().includes(searchTerm);

        const matchEducation = !education || item.교육수준 === education;
        const matchGrade = !grade || item.급수.includes(grade);
        const matchLength = !length || item.장단음 === length;

        return matchSearch && matchEducation && matchGrade && matchLength;
    });

    displayData(filtered);
}

function displayData(data) {
    const tbody = document.getElementById('tableBody');
    const resultCount = document.getElementById('resultCount');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;">검색 결과가 없습니다.</td></tr>';
        resultCount.textContent = '0개 한자';
        return;
    }

    tbody.innerHTML = data.map(item => {
        // 구분 필드 스타일 설정
        let typeColor = '#2c3e50'; // 기본 색상
        let typeWeight = 'normal';

        if (item.구분.includes('끝말')) {
            typeColor = '#e67e22'; // 끝말은 주황색
            typeWeight = '600';
        } else if (item.구분.includes('본음')) {
            typeColor = '#27ae60'; // 본음은 녹색
            typeWeight = '600';
        } else if (item.구분.includes('장음')) {
            typeColor = '#3498db'; // 장음은 파란색
            typeWeight = '600';
        }

        return `
        <tr>
            <td class="hanja-char">${item.한자}</td>
            <td>${item.음}</td>
            <td>${item.뜻}</td>
            <td style="color:${typeColor}; font-weight:${typeWeight}">${item.구분}</td>
            <td>${item.교육수준}</td>
            <td>${item.급수}</td>
            <td>${item.장단음}</td>
            <td>
                ${item.블로그링크 ?
                `<a href="${item.블로그링크}" target="_blank" class="blog-link">보기</a>` :
                '<span style="color:#999;">-</span>'}
            </td>
        </tr>
    `;
    }).join('');

    // 고유 한자 개수 계산
    const uniqueHanja = new Set(data.map(item => item.한자)).size;
    resultCount.textContent = `${uniqueHanja}개 한자`;
}
