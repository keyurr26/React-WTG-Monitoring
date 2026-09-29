// foundation-components/FoundationStyles.js
import {
    styled,
    alpha
} from "@mui/material/styles";
import {
    Card,
    Paper,
    Box,
    Chip,
    LinearProgress,
    Button
} from "@mui/material";


export const StyledCard = styled(Card)({
    height: '100%',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
});


export const ModalPaper = styled(Paper)({
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    borderRadius: '16px',
});

export const ModalHeader = styled(Box)({
    padding: '16px 24px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
});

export const ModalContent = styled(Box)({
    padding: '24px',
    overflow: 'auto',
    maxHeight: 'calc(90vh - 130px)',
});

export const StatusChip = styled(Chip)(({
    status
}) => {
    const colors = {
        completed: {
            bg: '#e8f5e9',
            color: '#2e7d32',
            border: '#4caf50'
        },
        in_progress: {
            bg: '#fff3e0',
            color: '#ed6c02',
            border: '#ff9800'
        },
        pending: {
            bg: '#ffebee',
            color: '#c62828',
            border: '#f44336'
        },
        scheduled: {
            bg: '#e3f2fd',
            color: '#1565c0',
            border: '#2196f3'
        }
    };
    const colorSet = colors[status] || colors.pending;

    return {
        backgroundColor: colorSet.bg,
        color: colorSet.color,
        borderColor: colorSet.border,
        fontWeight: 600,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
            color: colorSet.color,
            fontSize: '1rem',
        },
    };
});

export const ProgressBar = styled(LinearProgress)(({
    barColor
}) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        backgroundColor: barColor || '#667eea',
    },
}));

const FilterContainer = styled(Paper)(({
    theme
}) => ({
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid #e0e4ec',
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderColor: theme.palette.primary.light,
    },
}));

const ResetButton = styled(Button)(({
    theme
}) => ({
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '6px 16px',
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: theme.palette.error.lighter, // or alpha(theme.palette.error.main, 0.1)
    },
}));