// 데이터 로드 및 초기화
let hanjaData = [];

// 데이터 로드
fetch('data.json')
    .then(response => response.json())
    .then(data => {
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

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="hanja-char">${item.한자}</td>
            <td>${item.음}</td>
            <td>${item.뜻}</td>
            <td>${item.교육수준}</td>
            <td>${item.급수}</td>
            <td>${item.장단음}</td>
            <td>
                ${item.블로그링크 ?
            `<a href="${item.블로그링크}" target="_blank" class="blog-link">보기</a>` :
            '<span style="color:#999;">-</span>'}
            </td>
        </tr>
    `).join('');

    // 고유 한자 개수 계산
    const uniqueHanja = new Set(data.map(item => item.한자)).size;
    resultCount.textContent = `${uniqueHanja}개 한자`;
}
