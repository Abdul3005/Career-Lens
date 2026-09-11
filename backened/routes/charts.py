from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import os

router = APIRouter()

# ─── LOAD DATA ───────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'careerlens_dataset.csv')
df = pd.read_csv(DATA_PATH)

# Style
sns.set_theme(style="whitegrid")
COLORS = ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"]

def fig_to_response(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=130)
    buf.seek(0)
    plt.close(fig)
    return StreamingResponse(buf, media_type="image/png")

# ─── 1. SALARY BY ROLE ───────────────────────────────────
@router.get("/charts/salary-by-role")
def salary_by_role():
    data = df.groupby('Role')['Salary'].mean().sort_values(ascending=False)
    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(data.index, data.values, color=COLORS[:len(data)])
    ax.set_title('Average Salary by Role (PKR)', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Role', fontsize=11)
    ax.set_ylabel('Average Salary (PKR)', fontsize=11)
    for bar, val in zip(bars, data.values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1000,
                f'PKR {val:,.0f}', ha='center', va='bottom', fontsize=9)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 2. SALARY BY CITY ───────────────────────────────────
@router.get("/charts/salary-by-city")
def salary_by_city():
    data = df.groupby('City')['Salary'].mean().sort_values(ascending=False)
    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(data.index, data.values, color=COLORS[:len(data)])
    ax.set_title('Average Salary by City (PKR)', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('City', fontsize=11)
    ax.set_ylabel('Average Salary (PKR)', fontsize=11)
    for bar, val in zip(bars, data.values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1000,
                f'PKR {val:,.0f}', ha='center', va='bottom', fontsize=9)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 3. SALARY BY EXPERIENCE (BOX PLOT) ──────────────────
@router.get("/charts/salary-by-experience")
def salary_by_experience():
    order = ['Fresh', '6Months', '1Year', 'MoreThan1.5Years']
    fig, ax = plt.subplots(figsize=(9, 5))
    sns.boxplot(data=df, x='Experience', y='Salary', order=order,
                palette=COLORS[:4], ax=ax)
    ax.set_title('Salary Distribution by Experience Level', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Experience', fontsize=11)
    ax.set_ylabel('Salary (PKR)', fontsize=11)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 4. SALARY BY COMPANY SIZE (BOX PLOT) ────────────────
@router.get("/charts/salary-by-company")
def salary_by_company():
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.boxplot(data=df, x='Company_Size', y='Salary',
                order=['Small', 'Medium', 'Large'],
                palette=COLORS[:3], ax=ax)
    ax.set_title('Salary Distribution by Company Size', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Company Size', fontsize=11)
    ax.set_ylabel('Salary (PKR)', fontsize=11)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 5. EXPERIENCE VS SALARY (LINE CHART) ────────────────
@router.get("/charts/experience-growth")
def experience_growth():
    order = ['Fresh', '6Months', '1Year', 'MoreThan1.5Years']
    data  = df.groupby('Experience')['Salary'].mean().reindex(order)
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.plot(data.index, data.values, marker='o', color='#1D4ED8',
            linewidth=2.5, markersize=8)
    ax.fill_between(data.index, data.values, alpha=0.15, color='#1D4ED8')
    for x, y in zip(data.index, data.values):
        ax.annotate(f'PKR {y:,.0f}', (x, y), textcoords="offset points",
                    xytext=(0, 12), ha='center', fontsize=9)
    ax.set_title('Experience vs Salary Growth', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Experience Level', fontsize=11)
    ax.set_ylabel('Average Salary (PKR)', fontsize=11)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 6. SALARY DISTRIBUTION (NORMAL CURVE) ───────────────
@router.get("/charts/salary-distribution")
def salary_distribution():
    fig, ax = plt.subplots(figsize=(9, 5))
    sns.histplot(df['Salary'], kde=True, color='#1D4ED8',
                 ax=ax, bins=30, alpha=0.6)
    ax.set_title('Salary Distribution (Normal Curve)', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Salary (PKR)', fontsize=11)
    ax.set_ylabel('Frequency', fontsize=11)
    mean_sal = df['Salary'].mean()
    ax.axvline(mean_sal, color='red', linestyle='--', linewidth=1.5,
               label=f'Mean: PKR {mean_sal:,.0f}')
    ax.legend()
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 7. JOB TYPE PIE CHART ───────────────────────────────
@router.get("/charts/jobtype-distribution")
def jobtype_distribution():
    data = df['Job_Type'].value_counts()
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.pie(data.values, labels=data.index, autopct='%1.1f%%',
           colors=COLORS[:2], startangle=90,
           wedgeprops={'edgecolor': 'white', 'linewidth': 2})
    ax.set_title('Onsite vs Remote Distribution', fontsize=14, fontweight='bold', pad=15)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 8. COMPANY SIZE vs SALARY GROUPED BAR ───────────────
@router.get("/charts/company-salary-by-role")
def company_salary_by_role():
    data = df.groupby(['Company_Size', 'Role'])['Salary'].mean().unstack()
    fig, ax = plt.subplots(figsize=(11, 6))
    data.plot(kind='bar', ax=ax, color=COLORS[:4], width=0.7)
    ax.set_title('Company Size vs Salary by Role', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Company Size', fontsize=11)
    ax.set_ylabel('Average Salary (PKR)', fontsize=11)
    ax.legend(title='Role', bbox_to_anchor=(1.01, 1), loc='upper left')
    plt.xticks(rotation=0)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 9. CITY SALARY GROUPED BAR BY ROLE ─────────────────
@router.get("/charts/city-salary-by-role")
def city_salary_by_role():
    data = df.groupby(['City', 'Role'])['Salary'].mean().unstack()
    fig, ax = plt.subplots(figsize=(12, 6))
    data.plot(kind='bar', ax=ax, color=COLORS[:4], width=0.7)
    ax.set_title('City-wise Salary by Role', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('City', fontsize=11)
    ax.set_ylabel('Average Salary (PKR)', fontsize=11)
    ax.legend(title='Role', bbox_to_anchor=(1.01, 1), loc='upper left')
    plt.xticks(rotation=45)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 10. SKILL vs SALARY HEATMAP ─────────────────────────
@router.get("/charts/skill-salary-heatmap")
def skill_salary_heatmap():
    skill_cols = [
        'ReactJS', 'NodeJS', 'Python', 'SQL', 'MongoDB', 'Git',
        'Scikit_learn', 'TensorFlow', 'LLM', 'Pandas',
        'Agile', 'JIRA', 'Figma', 'Wireframing', 'Prototyping'
    ]
    corr_data = {}
    for skill in skill_cols:
        corr_data[skill] = df.groupby(skill)['Salary'].mean().to_dict()

    corr_df = pd.DataFrame(corr_data).T
    corr_df.columns = ['No Skill', 'Has Skill']
    corr_df['Salary Impact'] = corr_df['Has Skill'] - corr_df['No Skill']
    corr_df = corr_df.sort_values('Salary Impact', ascending=False)

    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(corr_df[['No Skill', 'Has Skill']],
                annot=True, fmt='.0f', cmap='Blues',
                ax=ax, linewidths=0.5)
    ax.set_title('Skill vs Salary Impact Heatmap (PKR)', fontsize=14, fontweight='bold', pad=15)
    plt.tight_layout()
    return fig_to_response(fig)

# ─── 11. JOBTYPE BY ROLE PIE ─────────────────────────────
@router.get("/charts/jobtype-by-role")
def jobtype_by_role():
    data = df.groupby(['Role', 'Job_Type']).size().unstack(fill_value=0)
    fig, axes = plt.subplots(1, 4, figsize=(14, 5))
    for idx, role in enumerate(data.index):
        axes[idx].pie(data.loc[role], labels=data.columns,
                      autopct='%1.1f%%', colors=COLORS[:2],
                      wedgeprops={'edgecolor': 'white', 'linewidth': 2})
        axes[idx].set_title(role, fontsize=10, fontweight='bold')
    fig.suptitle('Onsite vs Remote by Role', fontsize=14, fontweight='bold')
    plt.tight_layout()
    return fig_to_response(fig)